import { createMocks } from 'node-mocks-http'
import handler from '../../src/pages/api/pending-users'
import { db } from '../../src/lib/prisma'
import { getServerSession } from 'next-auth/next'

// Mock database service
jest.mock('../../src/lib/prisma', () => ({
  db: {
    getPendingUsers: jest.fn(),
    updateUserStatus: jest.fn(),
  },
}))

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}))

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('/api/pending-users', () => {
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

  describe('Authorization', () => {
    it('should reject non-admin users', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      const mockMemberSession = {
        user: { username: 'member', name: 'Member User', role: 'MEMBER' },
      }

      mockGetServerSession.mockResolvedValue(mockMemberSession)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(403)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Forbidden: Admin access required',
      })
    })
  })

  describe('GET /api/pending-users', () => {
    const mockAdminSession = {
      user: { username: 'admin', name: 'Admin User', role: 'ADMIN' },
    }

    it('should return pending users for admin', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      const mockPendingUsers = [
        {
          id: 'pending-1',
          username: 'newuser1',
          name: 'New User 1',
          email: 'newuser1@example.com',
          phone: '555-1111',
          createdAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: 'pending-2',
          username: 'newuser2',
          name: 'New User 2',
          email: 'newuser2@example.com',
          phone: null,
          createdAt: '2023-01-02T00:00:00.000Z',
        },
      ]

      mockGetServerSession.mockResolvedValue(mockAdminSession)
      ;(db.getPendingUsers as jest.Mock).mockResolvedValue(mockPendingUsers)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual(mockPendingUsers)
      expect(db.getPendingUsers).toHaveBeenCalled()
    })

    it('should return empty array when no pending users', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      mockGetServerSession.mockResolvedValue(mockAdminSession)
      ;(db.getPendingUsers as jest.Mock).mockResolvedValue([])

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual([])
    })

    it('should handle database errors gracefully', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      mockGetServerSession.mockResolvedValue(mockAdminSession)
      ;(db.getPendingUsers as jest.Mock).mockRejectedValue(new Error('Database connection failed'))

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Failed to fetch pending users',
      })
    })
  })

  describe('POST /api/pending-users', () => {
    const mockAdminSession = {
      user: { username: 'admin', name: 'Admin User', role: 'ADMIN' },
    }

    it('should approve user successfully', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          userId: 'pending-user-1',
          action: 'approve',
        },
      })

      mockGetServerSession.mockResolvedValue(mockAdminSession)
      ;(db.updateUserStatus as jest.Mock).mockResolvedValue(true)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual({
        message: 'User approved successfully',
        action: 'approve',
        userId: 'pending-user-1',
      })

      expect(db.updateUserStatus).toHaveBeenCalledWith('pending-user-1', 'APPROVED')
    })

    it('should reject user successfully', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          userId: 'pending-user-1',
          action: 'reject',
        },
      })

      mockGetServerSession.mockResolvedValue(mockAdminSession)
      ;(db.updateUserStatus as jest.Mock).mockResolvedValue(true)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual({
        message: 'User rejected successfully',
        action: 'reject',
        userId: 'pending-user-1',
      })

      expect(db.updateUserStatus).toHaveBeenCalledWith('pending-user-1', 'REJECTED')
    })

    it('should validate required fields', async () => {
      const testCases = [
        { 
          body: {}, 
          expectedError: 'Invalid request data' 
        },
        { 
          body: { userId: 'user-1' }, 
          expectedError: 'Invalid request data' 
        },
        { 
          body: { action: 'approve' }, 
          expectedError: 'Invalid request data' 
        },
      ]

      mockGetServerSession.mockResolvedValue(mockAdminSession)

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

      expect(db.updateUserStatus).not.toHaveBeenCalled()
    })

    it('should validate action values', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          userId: 'user-1',
          action: 'invalid-action',
        },
      })

      mockGetServerSession.mockResolvedValue(mockAdminSession)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Invalid request data',
      })

      expect(db.updateUserStatus).not.toHaveBeenCalled()
    })

    it('should handle non-existent user', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          userId: 'non-existent-user',
          action: 'approve',
        },
      })

      mockGetServerSession.mockResolvedValue(mockAdminSession)
      ;(db.updateUserStatus as jest.Mock).mockResolvedValue(false)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(404)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'User not found',
      })
    })

    it('should handle database errors during update', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          userId: 'user-1',
          action: 'approve',
        },
      })

      mockGetServerSession.mockResolvedValue(mockAdminSession)
      ;(db.updateUserStatus as jest.Mock).mockRejectedValue(new Error('Database connection lost'))

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Failed to update user status',
      })
    })
  })

  describe('Invalid HTTP methods', () => {
    it('should reject unsupported methods', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
      })

      const mockSession = {
        user: { username: 'admin', name: 'Admin User', role: 'ADMIN' },
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