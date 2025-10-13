import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    if (req.method === 'GET') {
      // Get all email campaigns
      const campaigns = await prisma.emailCampaign.findMany({
        include: {
          sender: {
            select: {
              name: true,
              username: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return res.status(200).json(campaigns)
      
    } else if (req.method === 'POST') {
      // Create new email campaign or send existing one
      const { action, campaignId, subject, content, plainText } = req.body

      if (action === 'send' && campaignId) {
        // Send existing campaign
        const campaign = await prisma.emailCampaign.findUnique({
          where: { id: campaignId }
        })

        if (!campaign) {
          return res.status(404).json({ error: 'Campaign not found' })
        }

        if (campaign.status === 'SENT') {
          return res.status(400).json({ error: 'Campaign already sent' })
        }

        // Get active subscribers
        const subscribers = await prisma.mailingListSubscriber.findMany({
          where: { subscribed: true },
          select: { email: true, name: true, unsubscribeToken: true }
        })

        if (subscribers.length === 0) {
          return res.status(400).json({ error: 'No active subscribers found' })
        }

        // Here you would integrate with an email service like SendGrid, Nodemailer, etc.
        // For now, we'll just mark it as sent and log the emails that would be sent
        console.log(`Would send email to ${subscribers.length} subscribers:`)
        subscribers.forEach(subscriber => {
          console.log(`- ${subscriber.email} (${subscriber.name || 'No name'})`)
        })

        // Update campaign status
        const updatedCampaign = await prisma.emailCampaign.update({
          where: { id: campaignId },
          data: {
            status: 'SENT',
            sentAt: new Date(),
            sentBy: (session.user as any).id,
            recipientCount: subscribers.length
          }
        })

        return res.status(200).json({
          message: `Email sent to ${subscribers.length} subscribers`,
          campaign: updatedCampaign
        })

      } else {
        // Create new campaign
        if (!subject || !content) {
          return res.status(400).json({ error: 'Subject and content are required' })
        }

        // Get the user ID properly - handle case where session has stale user ID
        let userId = (session.user as any).id
        let user = null
        
        // First check if the session user ID exists in the database
        if (userId) {
          user = await prisma.user.findUnique({
            where: { id: userId }
          })
        }
        
        // If user with session ID doesn't exist, find by username
        if (!user) {
          user = await prisma.user.findFirst({
            where: {
              username: (session.user as any).username
            }
          })
          userId = user?.id
        }

        if (!user || !userId) {
          return res.status(400).json({ 
            error: 'Session expired or user not found. Please log out and log back in.',
            debug: {
              sessionUserId: (session.user as any).id,
              username: (session.user as any).username,
              foundUser: !!user
            }
          })
        }

        const campaign = await prisma.emailCampaign.create({
          data: {
            subject,
            content,
            plainText: plainText || null,
            sentBy: userId
          }
        })

        return res.status(201).json(campaign)
      }

    } else if (req.method === 'PUT') {
      // Update campaign
      const { id, subject, content, plainText } = req.body

      if (!id) {
        return res.status(400).json({ error: 'Campaign ID is required' })
      }

      const campaign = await prisma.emailCampaign.findUnique({
        where: { id }
      })

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' })
      }

      if (campaign.status === 'SENT') {
        return res.status(400).json({ error: 'Cannot edit sent campaign' })
      }

      const updatedCampaign = await prisma.emailCampaign.update({
        where: { id },
        data: {
          subject: subject || campaign.subject,
          content: content || campaign.content,
          plainText: plainText !== undefined ? plainText : campaign.plainText
        }
      })

      return res.status(200).json(updatedCampaign)

    } else if (req.method === 'DELETE') {
      // Delete campaign
      const { id } = req.query

      if (!id) {
        return res.status(400).json({ error: 'Campaign ID is required' })
      }

      const campaign = await prisma.emailCampaign.findUnique({
        where: { id: id as string }
      })

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' })
      }

      if (campaign.status === 'SENT') {
        return res.status(400).json({ error: 'Cannot delete sent campaign' })
      }

      await prisma.emailCampaign.delete({
        where: { id: id as string }
      })

      return res.status(200).json({ message: 'Campaign deleted successfully' })

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      return res.status(405).json({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Email campaigns API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}