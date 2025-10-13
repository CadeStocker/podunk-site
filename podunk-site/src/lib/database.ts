import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

export interface User {
  id: string
  username: string
  name: string
  email?: string
  role: 'admin' | 'member'
  passwordHash: string
  createdAt: string
  lastLogin?: string
}

export interface Transaction {
  id: string
  date: string
  type: 'expense' | 'revenue'
  amount: number
  description: string
  category: string
  addedBy: string
  createdAt: string
}

class Database {
  private getUsers(): User[] {
    try {
      if (!fs.existsSync(USERS_FILE)) {
        return []
      }
      const data = fs.readFileSync(USERS_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error reading users file:', error)
      return []
    }
  }

  private saveUsers(users: User[]): void {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
    } catch (error) {
      console.error('Error saving users file:', error)
      throw new Error('Failed to save users')
    }
  }

  private getTransactions(): Transaction[] {
    try {
      if (!fs.existsSync(TRANSACTIONS_FILE)) {
        return []
      }
      const data = fs.readFileSync(TRANSACTIONS_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error reading transactions file:', error)
      return []
    }
  }

  private saveTransactions(transactions: Transaction[]): void {
    try {
      fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2))
    } catch (error) {
      console.error('Error saving transactions file:', error)
      throw new Error('Failed to save transactions')
    }
  }

  // Initialize database with default admin user if empty
  async initializeDatabase(): Promise<void> {
    const users = this.getUsers()
    
    if (users.length === 0) {
      const adminPasswordHash = await bcrypt.hash('PodunkRamblers2025!', 12)
      
      const defaultUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          name: 'Band Manager',
          role: 'admin',
          passwordHash: adminPasswordHash,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          username: 'cade',
          name: 'Cade Stocker',
          role: 'member',
          passwordHash: adminPasswordHash, // Same password initially
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          username: 'sutton', 
          name: 'Sutton',
          role: 'member',
          passwordHash: adminPasswordHash, // Same password initially
          createdAt: new Date().toISOString()
        }
      ]

      this.saveUsers(defaultUsers)

      // Add some sample transactions
      const sampleTransactions: Transaction[] = [
        {
          id: '1',
          date: '2025-10-01',
          type: 'revenue',
          amount: 500,
          description: 'Country Fair Gig',
          category: 'Performance',
          addedBy: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          date: '2025-10-05', 
          type: 'expense',
          amount: 50,
          description: 'Guitar strings',
          category: 'Equipment',
          addedBy: 'cade',
          createdAt: new Date().toISOString()
        }
      ]

      this.saveTransactions(sampleTransactions)
    }
  }

  // User methods
  async findUserByUsername(username: string): Promise<User | null> {
    const users = this.getUsers()
    return users.find(user => user.username === username) || null
  }

  async findUserById(id: string): Promise<User | null> {
    const users = this.getUsers()
    return users.find(user => user.id === id) || null
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'passwordHash'> & { password: string }): Promise<User> {
    const users = this.getUsers()
    const passwordHash = await bcrypt.hash(userData.password, 12)
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      passwordHash,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    this.saveUsers(users)
    
    return newUser
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
    const users = this.getUsers()
    const userIndex = users.findIndex(user => user.id === userId)
    
    if (userIndex === -1) return false
    
    users[userIndex].passwordHash = await bcrypt.hash(newPassword, 12)
    this.saveUsers(users)
    
    return true
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    const users = this.getUsers()
    const userIndex = users.findIndex(user => user.id === userId)
    
    if (userIndex !== -1) {
      users[userIndex].lastLogin = new Date().toISOString()
      this.saveUsers(users)
    }
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash)
  }

  // Transaction methods
  getAllTransactions(): Transaction[] {
    return this.getTransactions().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  addTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const transactions = this.getTransactions()
    
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    transactions.push(newTransaction)
    this.saveTransactions(transactions)
    
    return newTransaction
  }

  deleteTransaction(id: string, userId: string): boolean {
    const transactions = this.getTransactions()
    const transactionIndex = transactions.findIndex(t => t.id === id)
    
    if (transactionIndex === -1) return false
    
    // Only allow deletion by the creator or admin
    const transaction = transactions[transactionIndex]
    const user = this.getUsers().find(u => u.id === userId)
    
    if (transaction.addedBy !== user?.username && user?.role !== 'admin') {
      return false
    }
    
    transactions.splice(transactionIndex, 1)
    this.saveTransactions(transactions)
    
    return true
  }
}

// Export singleton instance
export const db = new Database()