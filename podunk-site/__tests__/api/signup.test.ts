import { createMocks } from 'node-mocks-http'
import handler from '../../src/pages/api/signup'
import { db } from '../../src/lib/prisma'

// Mock the database
jest.mock('../../src/lib/prisma', () => ({
  db: {
    findUserByUsername: jest.fn(),
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
  },
}))

describe('/api/signup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/signup', () => {
    it('should create a new user successfully', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          username: 'newuser',
          email: 'new@example.com',
          phone: '555-1234',
          password: 'securepassword123',
        },
      })

      const mockCreatedUser = {
        id: 'new-user-id',
        username: 'newuser',
        name: 'newuser',
        email: 'new@example.com',
        phone: '555-1234',
        role: 'MEMBER',
      }

      ;(db.findUserByEmail as jest.Mock).mockResolvedValue(null)
      ;(db.createUser as jest.Mock).mockResolvedValue(mockCreatedUser)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
      expect(JSON.parse(res._getData())).toEqual({
        message: 'Account created successfully',
        user: {
          id: mockCreatedUser.id,
          username: mockCreatedUser.username,
          email: mockCreatedUser.email,
          phone: mockCreatedUser.phone,
          role: mockCreatedUser.role,
        },
      })

      expect(db.createUser).toHaveBeenCalledWith({
        username: 'newuser',
        name: 'newuser',
        email: 'new@example.com',
        phone: '555-1234',
        password: 'securepassword123',
        role: 'MEMBER',
      })
    })

    it('should reject duplicate email', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          username: 'newuser',
          email: 'existing@example.com',
          phone: '555-1234',
          password: 'securepassword123',
        },
      })

      const existingUser = {
        id: 'existing-user',
        email: 'existing@example.com',
      }

      ;(db.findUserByEmail as jest.Mock).mockResolvedValue(existingUser)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'An account with this email already exists',
      })

      expect(db.createUser).not.toHaveBeenCalled()
    })

    it('should validate required fields', async () => {
      const testCases = [
        { 
          body: {}, 
          expectedError: 'All fields are required' 
        },
        { 
          body: { username: 'test' }, 
          expectedError: 'All fields are required' 
        },
        { 
          body: { username: 'test', email: 'test@example.com' }, 
          expectedError: 'All fields are required' 
        },
        { 
          body: { username: 'test', email: 'test@example.com', phone: '555-1234' }, 
          expectedError: 'All fields are required' 
        },
      ]

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

      expect(db.createUser).not.toHaveBeenCalled()
    })

    it('should validate password strength', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          username: 'newuser',
          email: 'new@example.com',
          phone: '555-1234',
          password: 'short',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Password must be at least 8 characters long',
      })

      expect(db.createUser).not.toHaveBeenCalled()
    })
  })

  describe('Error handling', () => {
    it('should handle database errors gracefully', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          username: 'newuser',
          email: 'new@example.com',
          phone: '555-1234',
          password: 'securepassword123',
        },
      })

      ;(db.findUserByEmail as jest.Mock).mockResolvedValue(null)
      ;(db.createUser as jest.Mock).mockRejectedValue(new Error('Database connection failed'))

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Failed to create account',
      })
    })
  })

  describe('Invalid HTTP methods', () => {
    it('should reject non-POST requests', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Method not allowed',
      })

      expect(db.createUser).not.toHaveBeenCalled()
    })
  })
})