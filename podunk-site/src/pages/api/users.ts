import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { db } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Get all users (admin only)
  if (req.method === 'GET') {
    try {
      const currentUser = await db.findUserByUsername((session.user as any).username)
      if (!currentUser) {
        return res.status(404).json({ error: 'User not found' })
      }

      const users = await db.getAllUsers(currentUser.id)
      return res.status(200).json(users)
    } catch (error) {
      console.error('Error fetching users:', error)
      return res.status(500).json({ error: 'Failed to fetch users' })
    }
  }

  // Delete user (admin only)
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'User ID required' })
      }

      const currentUser = await db.findUserByUsername((session.user as any).username)
      if (!currentUser) {
        return res.status(404).json({ error: 'User not found' })
      }

      const success = await db.deleteUser(id, currentUser.id)
      
      if (!success) {
        return res.status(403).json({ error: 'Not authorized to delete this user or cannot delete yourself' })
      }

      return res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
      console.error('Error deleting user:', error)
      return res.status(500).json({ error: 'Failed to delete user' })
    }
  }

  if (req.method === 'POST' && req.body.action === 'changePassword') {
    try {
      const { currentPassword, newPassword } = req.body

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new password required' })
      }

      const user = await db.findUserByUsername((session.user as any).username)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const isCurrentPasswordValid = await db.verifyPassword(user, currentPassword)
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' })
      }

      const success = await db.updateUserPassword(user.id, newPassword)
      if (success) {
        return res.status(200).json({ message: 'Password updated successfully' })
      } else {
        return res.status(500).json({ error: 'Failed to update password' })
      }
    } catch (error) {
      console.error('Error changing password:', error)
      return res.status(500).json({ error: 'Failed to change password' })
    }
  }

  if (req.method === 'POST' && req.body.action === 'createUser') {
    try {
      // Only admins can create new users
      const currentUser = await db.findUserByUsername((session.user as any).username)
      if (!currentUser || currentUser.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' })
      }

      const { username, name, email, role, password } = req.body

      if (!username || !name || !role || !password) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Check if user already exists
      const existingUser = await db.findUserByUsername(username)
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' })
      }

      const newUser = await db.createUser({
        username,
        name,
        email,
        role,
        password
      })

      return res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      })
    } catch (error) {
      console.error('Error creating user:', error)
      return res.status(500).json({ error: 'Failed to create user' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}