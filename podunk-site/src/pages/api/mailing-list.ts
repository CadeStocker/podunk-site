import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Get all subscribers (admin only)
      const session = await getServerSession(req, res, authOptions)
      
      if (!session || (session.user as any)?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' })
      }

      const subscribers = await prisma.mailingListSubscriber.findMany({
        where: { subscribed: true },
        orderBy: { subscribedAt: 'desc' }
      })

      return res.status(200).json(subscribers)
      
    } else if (req.method === 'POST') {
      // Subscribe to mailing list
      const { email, name } = req.body

      if (!email) {
        return res.status(400).json({ error: 'Email is required' })
      }

      // Check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' })
      }

      try {
        // Try to create new subscriber or update existing one
        const subscriber = await prisma.mailingListSubscriber.upsert({
          where: { email },
          update: {
            subscribed: true,
            subscribedAt: new Date(),
            unsubscribedAt: null,
            name: name || undefined
          },
          create: {
            email,
            name: name || null,
            subscribed: true
          }
        })

        return res.status(200).json({ 
          message: 'Successfully subscribed to mailing list!',
          subscriber: {
            id: subscriber.id,
            email: subscriber.email,
            name: subscriber.name
          }
        })

      } catch (error: any) {
        if (error.code === 'P2002') {
          // Unique constraint violation, user already subscribed
          return res.status(200).json({ message: 'You are already subscribed!' })
        }
        throw error
      }

    } else if (req.method === 'DELETE') {
      // Unsubscribe from mailing list
      const { email, token } = req.query

      if (!email && !token) {
        return res.status(400).json({ error: 'Email or unsubscribe token required' })
      }

      let whereClause: any = {}
      if (token) {
        whereClause.unsubscribeToken = token as string
      } else {
        whereClause.email = email as string
      }

      const subscriber = await prisma.mailingListSubscriber.update({
        where: whereClause,
        data: {
          subscribed: false,
          unsubscribedAt: new Date()
        }
      })

      return res.status(200).json({ message: 'Successfully unsubscribed from mailing list' })

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      return res.status(405).json({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Mailing list API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}