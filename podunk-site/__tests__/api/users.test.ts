import { createMocks } from 'node-mocks-http'
import handler from '../../src/pages/api/users'
import { db } from '../../src/lib/prisma'
import { getServerSession } from 'next-auth/next'

// Mock dependencies
jest.mock('../../src/lib/prisma', () => ({
  db: {
    getAllUsers: jest.fn(),
    findUserByUsername: jest.fn(),
    deleteUser: jest.fn(),
    updateUserPassword: jest.fn(),
    verifyPassword: jest.fn(),
  },
}))

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}))

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('/api/users', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication', () => {
    it('should reject unauthenticated requests', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      mockGetServerSession.mockResolvedValue(null)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Unauthorized',
      })
    })
  })

  describe('GET /api/users', () => {
    const mockAdminSession = {
      user: { username: 'admin', name: 'Admin User' },
    }

    const mockAdminUser = {
      id: 'admin-1',
      username: 'admin',
      name: 'Admin User',
      role: 'ADMIN',
    }

    it('should return all users for admin', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      const mockUsers = [
        {
          id: 'user-1',
          username: 'user1',
          name: 'User One',
          email: 'user1@example.com',
          phone: '555-1111',
          role: 'MEMBER',
          status: 'APPROVED',
          createdAt: new Date('2023-01-01'),
        },
        {
          id: 'user-2',
          username: 'user2',
          name: 'User Two',
          email: 'user2@example.com',
          phone: null,
          role: 'MEMBER',
          status: 'PENDING',
          createdAt: new Date('2023-01-02'),
        },
      ]

      mockGetServerSession.mockResolvedValue(mockAdminSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(mockAdminUser)
      ;(db.getAllUsers as jest.Mock).mockResolvedValue(mockUsers)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(mockUsers)
      expect(db.getAllUsers).toHaveBeenCalledWith('admin-1')
    })

    it('should return empty array for non-admin users', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      const mockMemberSession = {
        user: { username: 'member', name: 'Member User' },
      }

      const mockMemberUser = {
        id: 'member-1',
        username: 'member',
        name: 'Member User',
        role: 'MEMBER',
      }

      mockGetServerSession.mockResolvedValue(mockMemberSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(mockMemberUser)
      ;(db.getAllUsers as jest.Mock).mockResolvedValue([])

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual([])
      expect(db.getAllUsers).toHaveBeenCalledWith('member-1')
    })

    it('should handle non-existent user', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      mockGetServerSession.mockResolvedValue(mockAdminSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(null)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(404)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'User not found',
      })
    })
  })

  describe('DELETE /api/users', () => {
    const mockAdminSession = {
      user: { username: 'admin', name: 'Admin User' },
    }

    const mockAdminUser = {
      id: 'admin-1',
      username: 'admin',
      name: 'Admin User',
      role: 'ADMIN',
    }

    it('should delete user successfully (admin)', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'user-to-delete' },
      })

      mockGetServerSession.mockResolvedValue(mockAdminSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(mockAdminUser)
      ;(db.deleteUser as jest.Mock).mockResolvedValue(true)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual({
        message: 'User deleted successfully',
      })

      expect(db.deleteUser).toHaveBeenCalledWith('user-to-delete', 'admin-1')
    })

    it('should reject deletion without user ID', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: {},
      })

      mockGetServerSession.mockResolvedValue(mockAdminSession)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'User ID required',
      })

      expect(db.deleteUser).not.toHaveBeenCalled()
    })

    it('should reject unauthorized deletion (non-admin)', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'user-to-delete' },
      })

      const mockMemberSession = {
        user: { username: 'member', name: 'Member User' },
      }

      const mockMemberUser = {
        id: 'member-1',
        username: 'member',
        name: 'Member User',
        role: 'MEMBER',
      }

      mockGetServerSession.mockResolvedValue(mockMemberSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(mockMemberUser)
      ;(db.deleteUser as jest.Mock).mockResolvedValue(false)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(403)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Not authorized to delete this user or cannot delete yourself',
      })
    })

    it('should reject deletion of self', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'admin-1' }, // Same as admin user ID
      })

      mockGetServerSession.mockResolvedValue(mockAdminSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(mockAdminUser)
      ;(db.deleteUser as jest.Mock).mockResolvedValue(false) // Database function prevents self-deletion

      await handler(req, res)

      expect(res._getStatusCode()).toBe(403)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Not authorized to delete this user or cannot delete yourself',
      })
    })

    it('should handle non-existent requesting user', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'user-to-delete' },
      })

      mockGetServerSession.mockResolvedValue(mockAdminSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(null)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(404)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'User not found',
      })

      expect(db.deleteUser).not.toHaveBeenCalled()
    })
  })

  describe('POST /api/users - Change Password', () => {
    const mockSession = {
      user: { username: 'testuser', name: 'Test User' },
    }

    const mockUser = {
      id: 'user-1',
      username: 'testuser',
      name: 'Test User',
      role: 'MEMBER',
    }

    it('should change password successfully', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          action: 'changePassword',
          currentPassword: 'oldpassword123',
          newPassword: 'newpassword456',
        },
      })

      mockGetServerSession.mockResolvedValue(mockSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(mockUser)
      ;(db.verifyPassword as jest.Mock).mockResolvedValue(true)
      ;(db.updateUserPassword as jest.Mock).mockResolvedValue(true)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual({
        message: 'Password updated successfully',
      })

      expect(db.verifyPassword).toHaveBeenCalledWith(mockUser, 'oldpassword123')
      expect(db.updateUserPassword).toHaveBeenCalledWith('user-1', 'newpassword456')
    })

    it('should reject incorrect current password', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          action: 'changePassword',
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword456',
        },
      })

      mockGetServerSession.mockResolvedValue(mockSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(mockUser)
      ;(db.verifyPassword as jest.Mock).mockResolvedValue(false)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Current password is incorrect',
      })

      expect(db.updateUserPassword).not.toHaveBeenCalled()
    })

    it('should validate required fields for password change', async () => {
      const testCases = [
        { 
          body: { action: 'changePassword' }, 
          expectedError: 'Current and new password required' 
        },
        { 
          body: { action: 'changePassword', currentPassword: 'old' }, 
          expectedError: 'Current and new password required' 
        },
        { 
          body: { action: 'changePassword', newPassword: 'new' }, 
          expectedError: 'Current and new password required' 
        },
      ]

      mockGetServerSession.mockResolvedValue(mockSession)

      for (const testCase of testCases) {
        const { req, res } = createMocks({
          method: 'POST',
          body: testCase.body,
        })

        await handler(req, res)

        expect(res._getStatusCode()).toBe(400)
        expect(JSON.parse(res._getData())).toEqual({
          error: testCase.expectedError,
        })
      }

      expect(db.updateUserPassword).not.toHaveBeenCalled()
    })
  })

  describe('Invalid HTTP methods', () => {
    it('should reject unsupported methods', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
      })

      const mockSession = {
        user: { username: 'testuser', name: 'Test User' },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Method not allowed',
      })
    })
  })
})