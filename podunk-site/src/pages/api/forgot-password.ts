import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/prisma'
import { emailService } from '@/lib/email'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Check if user exists (case-insensitive)
    const user = await db.findUserByEmail(email.toLowerCase())
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ 
        message: 'If an account with this email exists, you will receive a password reset link.' 
      })
    }

    // Create reset token
    const resetToken = await db.createPasswordResetToken(email)

    // Send reset email
    const emailSent = await emailService.sendPasswordResetEmail(
      email, 
      resetToken, 
      user.name
    )

    if (!emailSent) {
      console.error('Failed to send password reset email to:', email)
      return res.status(500).json({ error: 'Failed to send reset email' })
    }

    return res.status(200).json({ 
      message: 'If an account with this email exists, you will receive a password reset link.' 
    })

  } catch (error) {
    console.error('Password reset request error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}