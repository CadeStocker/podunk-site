import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export interface CreateUserData {
  username: string
  email: string
  phone?: string
  name: string
  role?: 'ADMIN' | 'MEMBER'
  password: string
}

export interface CreateTransactionData {
  type: 'EXPENSE' | 'REVENUE'
  amount: number
  description: string
  category: string
  date: Date
  receiptUrl?: string
  notes?: string
  userId: string
}

class DatabaseService {
  // Initialize database with default users
  async initializeDatabase() {
    try {
      const userCount = await prisma.user.count()
      
      if (userCount === 0) {
        const adminPasswordHash = await bcrypt.hash('PodunkRamblers2025!', 12)
        
        // Create default users
        await prisma.user.createMany({
          data: [
            {
              username: 'admin',
              email: 'podunkramblers+admin@gmail.com',
              name: 'Band Manager',
              role: 'ADMIN',
              passwordHash: adminPasswordHash,
            },
            {
              username: 'cade',
              email: 'podunkramblers+cade@gmail.com',
              name: 'Cade Stocker',
              role: 'MEMBER',
              passwordHash: adminPasswordHash,
            },
            {
              username: 'sutton',
              email: 'podunkramblers+sutton@gmail.com', 
              name: 'Sutton',
              role: 'MEMBER',
              passwordHash: adminPasswordHash,
            }
          ]
        })

        console.log('Database initialized with default user accounts')
      }
    } catch (error) {
      console.error('Error initializing database:', error)
      throw error
    }
  }

  // User methods
  async findUserByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username }
    })
  }

  async findUserByEmail(email: string) {
    // Convert to lowercase for case-insensitive search
    const normalizedEmail = email.toLowerCase()
    return prisma.user.findFirst({
      where: { 
        email: {
          equals: normalizedEmail
        }
      }
    })
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    })
  }

  async createUser(userData: CreateUserData) {
    const passwordHash = await bcrypt.hash(userData.password, 12)
    
    // Extract password from userData and create user without it
    const { password, ...userDataWithoutPassword } = userData
    
    return prisma.user.create({
      data: {
        ...userDataWithoutPassword,
        email: userData.email.toLowerCase(), // Normalize email to lowercase
        passwordHash,
        role: userData.role || 'MEMBER'
      }
    })
  }

  async updateUserPassword(userId: string, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 12)
    
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    })
    
    return true
  }

  async updateUserLastLogin(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() }
    })
  }

  async verifyPassword(user: { passwordHash: string }, password: string) {
    return bcrypt.compare(password, user.passwordHash)
  }

  // Password reset methods
  async createPasswordResetToken(email: string) {
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now
    
    await prisma.passwordResetRequest.create({
      data: {
        email,
        token,
        expiresAt
      }
    })
    
    return token
  }

  async validatePasswordResetToken(token: string) {
    const resetRequest = await prisma.passwordResetRequest.findUnique({
      where: { token }
    })
    
    if (!resetRequest || resetRequest.used || resetRequest.expiresAt < new Date()) {
      return null
    }
    
    return resetRequest
  }

  async resetPassword(token: string, newPassword: string) {
    const resetRequest = await this.validatePasswordResetToken(token)
    if (!resetRequest) return false
    
    const user = await this.findUserByEmail(resetRequest.email)
    if (!user) return false
    
    // Update password
    await this.updateUserPassword(user.id, newPassword)
    
    // Mark token as used
    await prisma.passwordResetRequest.update({
      where: { id: resetRequest.id },
      data: { used: true }
    })
    
    return true
  }

  // Transaction methods
  async getAllTransactions() {
    return prisma.transaction.findMany({
      include: {
        user: {
          select: {
            username: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async createTransaction(data: CreateTransactionData) {
    return prisma.transaction.create({
      data,
      include: {
        user: {
          select: {
            username: true,
            name: true
          }
        }
      }
    })
  }

  async deleteTransaction(id: string, userId: string) {
    // Check if user owns the transaction or is admin
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { user: true }
    })
    
    if (!transaction) return false
    
    const requestingUser = await this.findUserById(userId)
    if (!requestingUser) return false
    
    // Allow deletion if user owns the transaction or is admin
    if (transaction.userId !== userId && requestingUser.role !== 'ADMIN') {
      return false
    }
    
    await prisma.transaction.delete({
      where: { id }
    })
    
    return true
  }

  // Get all pending users for admin approval
  async getPendingUsers() {
    return prisma.user.findMany({
      where: {
        status: 'PENDING'
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  // Update user status (approve/reject)
  async updateUserStatus(userId: string, status: 'APPROVED' | 'REJECTED') {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { status }
      })
      return true
    } catch (error) {
      console.error('Error updating user status:', error)
      return false
    }
  }

  // Delete user (admin only)
  async deleteUser(userId: string, requestingUserId: string) {
    try {
      // Check if requesting user is admin
      const requestingUser = await this.findUserById(requestingUserId)
      if (!requestingUser || requestingUser.role !== 'ADMIN') {
        return false
      }

      // Don't allow admins to delete themselves
      if (userId === requestingUserId) {
        return false
      }

      // Delete the user (this will cascade delete their transactions)
      await prisma.user.delete({
        where: { id: userId }
      })
      
      return true
    } catch (error) {
      console.error('Error deleting user:', error)
      return false
    }
  }

  // Get all users (admin only)
  async getAllUsers(requestingUserId: string) {
    try {
      // Check if requesting user is admin
      const requestingUser = await this.findUserById(requestingUserId)
      if (!requestingUser || requestingUser.role !== 'ADMIN') {
        return []
      }

      return await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      console.error('Error fetching all users:', error)
      return []
    }
  }

  // File management methods
  async getAllFiles() {
    return prisma.file.findMany({
      include: {
        uploader: {
          select: {
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    })
  }

  async createFile(fileData: {
    name: string
    originalName: string
    mimeType: string
    size: number
    category?: string
    description?: string
    filePath: string
    uploadedBy: string
  }) {
    return prisma.file.create({
      data: fileData,
      include: {
        uploader: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    })
  }

  async deleteFile(fileId: string, requestingUserId: string) {
    try {
      // Get file record
      const file = await prisma.file.findUnique({
        where: { id: fileId },
      })

      if (!file) return false

      // Get requesting user
      const requestingUser = await this.findUserById(requestingUserId)
      if (!requestingUser) return false

      // Allow deletion if user uploaded the file or is admin
      if (file.uploadedBy !== requestingUserId && requestingUser.role !== 'ADMIN') {
        return false
      }

      // Delete the file record
      await prisma.file.delete({
        where: { id: fileId },
      })

      return true
    } catch (error) {
      console.error('Error deleting file:', error)
      return false
    }
  }

  async getFileById(fileId: string) {
    return prisma.file.findUnique({
      where: { id: fileId },
      include: {
        uploader: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    })
  }
}

export const db = new DatabaseService()