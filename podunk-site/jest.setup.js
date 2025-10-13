import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock NextAuth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}))

// Mock NextAuth default export
jest.mock('next-auth', () => {
  return jest.fn()
})

// Mock Prisma database service
jest.mock('./src/lib/prisma', () => ({
  db: {
    initializeDatabase: jest.fn().mockResolvedValue(undefined),
    findUserByUsername: jest.fn(),
    verifyPassword: jest.fn(),
    createUser: jest.fn(),
    updateUserPassword: jest.fn(),
    deleteUser: jest.fn(),
    getAllUsers: jest.fn(),
    createTransaction: jest.fn(),
    getAllTransactions: jest.fn(),
    updateTransaction: jest.fn(),
    deleteTransaction: jest.fn(),
    getPendingUsers: jest.fn(),
    updateUserStatus: jest.fn(),
    findUserByEmail: jest.fn(),
  },
}))

// Mock auth options to prevent initialization
jest.mock('./src/pages/api/auth/[...nextauth]', () => ({
  authOptions: {
    providers: [],
    callbacks: {},
  },
}))

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  })),
}))

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
})

// Setup environment variables for testing
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'