import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { db } from '@/lib/prisma'

/*
  API route to handle financial transactions.

  This is an api that the frontend can call to get or modify transaction data.

  Supports:
  - GET: Fetch all transactions
  - POST: Create a new transaction
  - DELETE: Delete a transaction by ID (only by the user who created it)
*/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const transactions = await db.getAllTransactions()
      // Transform to match frontend expectations
      const transformedTransactions = transactions.map((t: any) => ({
        id: t.id,
        date: t.date.toISOString().split('T')[0],
        type: t.type.toLowerCase(),
        amount: t.amount,
        description: t.description,
        category: t.category,
        addedBy: t.user.username,
        createdAt: t.createdAt.toISOString()
      }))
      return res.status(200).json(transformedTransactions)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      return res.status(500).json({ error: 'Failed to fetch transactions' })
    }
  }

  // Create a new transaction
  if (req.method === 'POST') {
    try {
      const { type, amount, description, category, date } = req.body

      if (!type || !amount || !description || !category) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const user = await db.findUserByUsername((session.user as any).username)
      if (!user) {
        return res.status(401).json({ error: 'User not found' })
      }

      const transaction = await db.createTransaction({
        type: type.toUpperCase(),
        amount: parseFloat(amount),
        description,
        category,
        date: date ? new Date(date) : new Date(),
        userId: user.id
      })

      // Transform to match frontend expectations
      const transformedTransaction = {
        id: transaction.id,
        date: transaction.date.toISOString().split('T')[0],
        type: transaction.type.toLowerCase(),
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category,
        addedBy: transaction.user.username,
        createdAt: transaction.createdAt.toISOString()
      }

      return res.status(201).json(transformedTransaction)
    } catch (error) {
      console.error('Error creating transaction:', error)
      return res.status(500).json({ error: 'Failed to create transaction' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      
      console.log('DELETE request received for transaction ID:', id)
      
      if (!id || typeof id !== 'string') {
        console.log('Invalid or missing transaction ID')
        return res.status(400).json({ error: 'Transaction ID required' })
      }

      const user = await db.findUserByUsername((session.user as any).username)
      if (!user) {
        console.log('User not found:', (session.user as any).username)
        console.log('Session user object:', session.user)
        return res.status(401).json({ error: 'User not found' })
      }

      console.log('Attempting to delete transaction:', id, 'by user:', user.id, 'username:', user.username, 'role:', user.role)
      const success = await db.deleteTransaction(id, user.id)
      
      if (!success) {
        console.log('Delete transaction failed - not authorized or transaction not found')
        return res.status(403).json({ error: 'Not authorized to delete this transaction or transaction not found' })
      }

      console.log('Transaction deleted successfully:', id)
      return res.status(200).json({ message: 'Transaction deleted successfully' })
    } catch (error) {
      console.error('Error deleting transaction:', error)
      return res.status(500).json({ error: 'Failed to delete transaction', details: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}