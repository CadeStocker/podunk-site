import { createMocks } from 'node-mocks-http'
import handler from '../../src/pages/api/transactions'
import { db } from '../../src/lib/prisma'
import { getServerSession } from 'next-auth/next'

// Mock dependencies
jest.mock('../../src/lib/prisma', () => ({
  db: {
    getAllTransactions: jest.fn(),
    findUserByUsername: jest.fn(),
    createTransaction: jest.fn(),
    deleteTransaction: jest.fn(),
  },
}))

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}))

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('/api/transactions', () => {
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

  describe('GET /api/transactions', () => {
    const mockSession = {
      user: { username: 'testuser', name: 'Test User' },
    }

    it('should return all transactions successfully', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      const mockTransactions = [
        {
          id: 'trans-1',
          type: 'EXPENSE',
          amount: 100.50,
          description: 'Test expense',
          category: 'Equipment',
          date: new Date('2023-01-01'),
          createdAt: new Date('2023-01-01'),
          user: { username: 'testuser' },
        },
        {
          id: 'trans-2', 
          type: 'REVENUE',
          amount: 250.00,
          description: 'Test revenue',
          category: 'Performance',
          date: new Date('2023-01-02'),
          createdAt: new Date('2023-01-02'),
          user: { username: 'adminuser' },
        },
      ]

      mockGetServerSession.mockResolvedValue(mockSession)
      ;(db.getAllTransactions as jest.Mock).mockResolvedValue(mockTransactions)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      
      const responseData = JSON.parse(res._getData())
      expect(responseData).toHaveLength(2)
      expect(responseData[0]).toEqual({
        id: 'trans-1',
        date: '2023-01-01',
        type: 'expense',
        amount: 100.50,
        description: 'Test expense',
        category: 'Equipment',
        addedBy: 'testuser',
        createdAt: mockTransactions[0].createdAt.toISOString(),
      })
    })

    it('should handle database errors gracefully', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      mockGetServerSession.mockResolvedValue(mockSession)
      ;(db.getAllTransactions as jest.Mock).mockRejectedValue(new Error('Database error'))

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Failed to fetch transactions',
      })
    })
  })

  describe('POST /api/transactions', () => {
    const mockSession = {
      user: { username: 'testuser', name: 'Test User' },
    }

    const mockUser = {
      id: 'user-1',
      username: 'testuser',
      name: 'Test User',
      role: 'MEMBER',
    }

    it('should create a new transaction successfully', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          type: 'expense',
          amount: 75.25,
          description: 'New test expense',
          category: 'Travel',
          date: '2023-01-15',
        },
      })

      const mockCreatedTransaction = {
        id: 'new-trans-1',
        type: 'EXPENSE',
        amount: 75.25,
        description: 'New test expense',
        category: 'Travel',
        date: new Date('2023-01-15'),
        createdAt: new Date(),
        user: { username: 'testuser' },
      }

      mockGetServerSession.mockResolvedValue(mockSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(mockUser)
      ;(db.createTransaction as jest.Mock).mockResolvedValue(mockCreatedTransaction)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
      
      const responseData = JSON.parse(res._getData())
      expect(responseData).toEqual({
        id: 'new-trans-1',
        date: '2023-01-15',
        type: 'expense',
        amount: 75.25,
        description: 'New test expense',
        category: 'Travel',
        addedBy: 'testuser',
        createdAt: mockCreatedTransaction.createdAt.toISOString(),
      })

      expect(db.createTransaction).toHaveBeenCalledWith({
        type: 'EXPENSE',
        amount: 75.25,
        description: 'New test expense',
        category: 'Travel',
        date: new Date('2023-01-15'),
        userId: 'user-1',
      })
    })

    it('should validate required fields', async () => {
      const testCases = [
        { body: {}, expectedError: 'Missing required fields' },
        { body: { type: 'expense' }, expectedError: 'Missing required fields' },
        { body: { type: 'expense', amount: 100 }, expectedError: 'Missing required fields' },
        { body: { type: 'expense', amount: 100, description: 'test' }, expectedError: 'Missing required fields' },
      ]

      mockGetServerSession.mockResolvedValue(mockSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(mockUser)

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

      expect(db.createTransaction).not.toHaveBeenCalled()
    })

    it('should reject requests from non-existent users', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          type: 'expense',
          amount: 100,
          description: 'Test expense',
          category: 'Test',
        },
      })

      mockGetServerSession.mockResolvedValue(mockSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(null)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'User not found',
      })

      expect(db.createTransaction).not.toHaveBeenCalled()
    })
  })

  describe('DELETE /api/transactions', () => {
    const mockSession = {
      user: { username: 'testuser', name: 'Test User' },
    }

    const mockUser = {
      id: 'user-1',
      username: 'testuser',
      name: 'Test User',
      role: 'MEMBER',
    }

    const mockAdminUser = {
      id: 'admin-1',
      username: 'admin',
      name: 'Admin User',
      role: 'ADMIN',
    }

    it('should delete transaction successfully (owner)', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'trans-1' },
      })

      mockGetServerSession.mockResolvedValue(mockSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(mockUser)
      ;(db.deleteTransaction as jest.Mock).mockResolvedValue(true)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual({
        message: 'Transaction deleted successfully',
      })

      expect(db.deleteTransaction).toHaveBeenCalledWith('trans-1', 'user-1')
    })

    it('should delete transaction successfully (admin)', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'trans-1' },
      })

      const adminSession = {
        user: { username: 'admin', name: 'Admin User' },
      }

      mockGetServerSession.mockResolvedValue(adminSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(mockAdminUser)
      ;(db.deleteTransaction as jest.Mock).mockResolvedValue(true)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(JSON.parse(res._getData())).toEqual({
        message: 'Transaction deleted successfully',
      })

      expect(db.deleteTransaction).toHaveBeenCalledWith('trans-1', 'admin-1')
    })

    it('should reject deletion without transaction ID', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: {},
      })

      mockGetServerSession.mockResolvedValue(mockSession)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Transaction ID required',
      })

      expect(db.deleteTransaction).not.toHaveBeenCalled()
    })

    it('should reject unauthorized deletion', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'trans-1' },
      })

      mockGetServerSession.mockResolvedValue(mockSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(mockUser)
      ;(db.deleteTransaction as jest.Mock).mockResolvedValue(false)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(403)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Not authorized to delete this transaction or transaction not found',
      })
    })

    it('should handle non-existent user', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'trans-1' },
      })

      mockGetServerSession.mockResolvedValue(mockSession)
      ;(db.findUserByUsername as jest.Mock).mockResolvedValue(null)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'User not found',
      })

      expect(db.deleteTransaction).not.toHaveBeenCalled()
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