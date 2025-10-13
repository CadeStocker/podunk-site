import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const user = await db.findUserByEmail(email.toLowerCase())
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json({
      status: user.status,
      exists: true
    })

  } catch (error) {
    console.error('Error checking user status:', error)
    return res.status(500).json({ error: 'Failed to check user status' })
  }
}