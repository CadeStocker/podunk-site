import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, email, phone, password } = req.body

    // Validation
    if (!username || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' })
    }

    // Check if user already exists
    const existingUser = await db.findUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' })
    }

    // Create the user (role defaults to 'MEMBER')
    const newUser = await db.createUser({
      username,
      name: username, // Use username as display name
      email: email.toLowerCase(), // Store emails in lowercase for consistency
      phone,
      password,
      role: 'MEMBER' // New users are regular members, not admins
    })

    // Return success (don't include sensitive data)
    return res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({ error: 'Failed to create account' })
  }
}