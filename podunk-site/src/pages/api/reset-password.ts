import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' })
    }

    // Validate token and reset password
    const success = await db.resetPassword(token, password)

    if (!success) {
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }

    return res.status(200).json({ 
      message: 'Password has been successfully reset. You can now log in with your new password.' 
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}