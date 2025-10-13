import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { db } from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Only admins can manage pending users
  if ((session.user as any).role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' })
  }

  if (req.method === 'GET') {
    try {
      const pendingUsers = await db.getPendingUsers()
      return res.status(200).json(pendingUsers)
    } catch (error) {
      console.error('Error fetching pending users:', error)
      return res.status(500).json({ error: 'Failed to fetch pending users' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { userId, action } = req.body

      if (!userId || !action || !['approve', 'reject'].includes(action)) {
        return res.status(400).json({ error: 'Invalid request data' })
      }

      const success = await db.updateUserStatus(userId, action === 'approve' ? 'APPROVED' : 'REJECTED')
      
      if (!success) {
        return res.status(404).json({ error: 'User not found' })
      }

      return res.status(200).json({ 
        message: `User ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        action,
        userId
      })
    } catch (error) {
      console.error('Error updating user status:', error)
      return res.status(500).json({ error: 'Failed to update user status' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}