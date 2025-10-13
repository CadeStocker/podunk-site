'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import FileManager from '../../components/FileManager'
import DashboardEntrance from '../../components/DashboardEntrance'
import EmailCampaignManager from '../../components/EmailCampaignManager'

interface Transaction {
  id: string
  date: string
  type: 'expense' | 'revenue'
  amount: number
  description: string
  category: string
  addedBy: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'expense' | 'revenue',
    amount: '',
    description: '',
    category: ''
  })

  const [showAddForm, setShowAddForm] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [pendingUsers, setPendingUsers] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [showAllUsers, setShowAllUsers] = useState(false)
  const [showFileManager, setShowFileManager] = useState(false)
  const [showEmailManager, setShowEmailManager] = useState(false)

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesCategory = !categoryFilter || transaction.category === categoryFilter
    const matchesType = !typeFilter || transaction.type === typeFilter
    return matchesCategory && matchesType
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    
    // Load transactions from API
    fetchTransactions()
    
    // Load pending users for admins
    if ((session.user as any).role === 'ADMIN') {
      fetchPendingUsers()
      fetchAllUsers()
    }
  }, [session, status, router])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch('/api/pending-users')
      if (response.ok) {
        const data = await response.json()
        setPendingUsers(data)
      }
    } catch (error) {
      console.error('Error fetching pending users:', error)
    }
  }

  const fetchAllUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setAllUsers(data)
      }
    } catch (error) {
      console.error('Error fetching all users:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#13477B'
      }}>
        <div style={{ color: 'white', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: newTransaction.type,
          amount: parseFloat(newTransaction.amount),
          description: newTransaction.description,
          category: newTransaction.category,
          date: new Date().toISOString().split('T')[0]
        })
      })

      if (response.ok) {
        const newTransactionData = await response.json()
        setTransactions([newTransactionData, ...transactions])
        setNewTransaction({
          type: 'expense',
          amount: '',
          description: '',
          category: ''
        })
        setShowAddForm(false)
      } else {
        console.error('Failed to add transaction')
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return
    }

    try {
      const response = await fetch(`/api/transactions?id=${transactionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Remove the transaction from the local state
        setTransactions(transactions.filter(t => t.id !== transactionId))
        alert('Transaction deleted successfully')
      } else {
        // Try to parse JSON error, but fallback to generic message if it fails
        try {
          const data = await response.json()
          alert(data.error || 'Failed to delete transaction')
        } catch (parseError) {
          console.error('Error parsing response:', parseError)
          alert(`Failed to delete transaction (Status: ${response.status})`)
        }
      }
    } catch (error) {
      console.error('Error deleting transaction:', error)
      alert('Failed to delete transaction')
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This will also delete all their transactions.`)) {
      return
    }

    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Refresh both user lists and transactions
        fetchAllUsers()
        fetchPendingUsers()
        fetchTransactions()
        alert(`${userName} has been deleted successfully`)
      } else {
        // Try to parse JSON error, but fallback to generic message if it fails
        try {
          const data = await response.json()
          alert(data.error || 'Failed to delete user')
        } catch (parseError) {
          console.error('Error parsing response:', parseError)
          alert(`Failed to delete user (Status: ${response.status})`)
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  // Overall totals
  const totalRevenue = transactions
    .filter(t => t.type === 'revenue')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense') 
    .reduce((sum, t) => sum + t.amount, 0)

  const profit = totalRevenue - totalExpenses

  // Filtered totals
  const filteredRevenue = filteredTransactions
    .filter(t => t.type === 'revenue')
    .reduce((sum, t) => sum + t.amount, 0)

  const filteredExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const filteredProfit = filteredRevenue - filteredExpenses

  return (
    <DashboardEntrance isAuthenticated={!!session}>
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#13477B',
        padding: '2rem 1rem'
      }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ color: '#13477B', margin: 0, fontSize: '2rem' }}>
              Band Dashboard
            </h1>
            <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
              Welcome back, {session.user?.name}! 
              {(session.user as any).role === 'ADMIN' && ' (Admin)'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {(session.user as any).role === 'ADMIN' && (
              <button
                onClick={() => {
                  const signupUrl = `${window.location.origin}/signup`
                  navigator.clipboard.writeText(signupUrl).then(() => {
                    alert('Signup link copied to clipboard!\n\nShare this link: ' + signupUrl)
                  }).catch(() => {
                    alert('Signup link: ' + signupUrl + '\n\nCopy this link to share with new band members.')
                  })
                }}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                📤 Share Signup Link
              </button>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Financial Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#28a745', margin: '0 0 0.5rem 0' }}>
              {(categoryFilter || typeFilter) ? 'Filtered ' : 'Total '}Revenue
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745', margin: 0 }}>
              ${(categoryFilter || typeFilter) ? filteredRevenue.toFixed(2) : totalRevenue.toFixed(2)}
            </p>
            {(categoryFilter || typeFilter) && (
              <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0 0 0' }}>
                of ${totalRevenue.toFixed(2)} total
              </p>
            )}
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#dc3545', margin: '0 0 0.5rem 0' }}>
              {(categoryFilter || typeFilter) ? 'Filtered ' : 'Total '}Expenses
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545', margin: 0 }}>
              ${(categoryFilter || typeFilter) ? filteredExpenses.toFixed(2) : totalExpenses.toFixed(2)}
            </p>
            {(categoryFilter || typeFilter) && (
              <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0 0 0' }}>
                of ${totalExpenses.toFixed(2)} total
              </p>
            )}
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: (categoryFilter || typeFilter) 
                ? (filteredProfit >= 0 ? '#28a745' : '#dc3545')
                : (profit >= 0 ? '#28a745' : '#dc3545'), 
              margin: '0 0 0.5rem 0' 
            }}>
              {(categoryFilter || typeFilter) ? 'Filtered ' : 'Net '}Profit
            </h3>
            <p style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: (categoryFilter || typeFilter) 
                ? (filteredProfit >= 0 ? '#28a745' : '#dc3545')
                : (profit >= 0 ? '#28a745' : '#dc3545'), 
              margin: 0 
            }}>
              ${(categoryFilter || typeFilter) ? filteredProfit.toFixed(2) : profit.toFixed(2)}
            </p>
            {(categoryFilter || typeFilter) && (
              <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0 0 0' }}>
                of ${profit.toFixed(2)} total
              </p>
            )}
          </div>
        </div>

        {/* Pending Users Section - Admin Only */}
        {(session.user as any).role === 'ADMIN' && pendingUsers.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            marginBottom: '2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            border: '2px solid #ffc107'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h2 style={{ color: '#856404', margin: 0 }}>
                  ⚠️ Pending User Approvals ({pendingUsers.length})
                </h2>
                <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
                  New users waiting for approval to access the dashboard
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gap: '1rem'
            }}>
              {pendingUsers.map((user) => (
                <div key={user.id} style={{
                  padding: '1rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  backgroundColor: '#fff3cd',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                      {user.name} ({user.username})
                    </h4>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                      📧 {user.email}
                    </p>
                    {user.phone && (
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                        📱 {user.phone}
                      </p>
                    )}
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#856404' }}>
                      Signed up: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/pending-users', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: user.id, action: 'approve' })
                          })
                          if (response.ok) {
                            alert(`${user.name} has been approved!`)
                            fetchPendingUsers() // Refresh the list
                          }
                        } catch (error) {
                          alert('Error approving user')
                        }
                      }}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Are you sure you want to reject ${user.name}?`)) {
                          try {
                            const response = await fetch('/api/pending-users', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ userId: user.id, action: 'reject' })
                            })
                            if (response.ok) {
                              alert(`${user.name} has been rejected.`)
                              fetchPendingUsers() // Refresh the list
                            }
                          } catch (error) {
                            alert('Error rejecting user')
                          }
                        }
                      }}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Users Management (Admin Only) */}
        {(session.user as any).role === 'ADMIN' && allUsers.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            marginBottom: '2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{ color: '#13477B', margin: 0 }}>
                👥 All Users ({allUsers.length})
              </h3>
              <button
                onClick={() => setShowAllUsers(!showAllUsers)}
                style={{
                  backgroundColor: '#13477B',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {showAllUsers ? 'Hide' : 'Show'} All Users
              </button>
            </div>
            
            {showAllUsers && (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {allUsers.map((user) => (
                  <div key={user.id} style={{
                    padding: '1rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: user.status === 'APPROVED' ? '#f8f9fa' : 
                                   user.status === 'PENDING' ? '#fff3cd' : '#f8d7da',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                        {user.name} ({user.username})
                        <span style={{
                          marginLeft: '0.5rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          backgroundColor: user.role === 'ADMIN' ? '#007bff' : '#6c757d',
                          color: 'white'
                        }}>
                          {user.role}
                        </span>
                      </h4>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                        📧 {user.email}
                      </p>
                      {user.phone && (
                        <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                          📱 {user.phone}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#666' }}>
                        <span>Status: 
                          <span style={{
                            marginLeft: '0.25rem',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '3px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            backgroundColor: user.status === 'APPROVED' ? '#d4edda' : 
                                           user.status === 'PENDING' ? '#fff3cd' : '#f8d7da',
                            color: user.status === 'APPROVED' ? '#155724' : 
                                   user.status === 'PENDING' ? '#856404' : '#721c24'
                          }}>
                            {user.status}
                          </span>
                        </span>
                        <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {user.role !== 'ADMIN' && user.id !== (session.user as any).id && (
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      )}
                      {user.role === 'ADMIN' && (
                        <span style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          backgroundColor: '#f8f9fa',
                          color: '#6c757d',
                          fontSize: '0.9rem',
                          fontStyle: 'italic'
                        }}>
                          Admin (Cannot Delete)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Transaction */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: showAddForm ? '1.5rem' : '0'
          }}>
            <h2 style={{ color: '#13477B', margin: 0 }}>Transactions</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                backgroundColor: '#13477B',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {showAddForm ? 'Cancel' : 'Add Transaction'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddTransaction} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 'bold',
                  color: '#333333',
                  fontSize: '14px'
                }}>
                  Type
                </label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction,
                    type: e.target.value as 'expense' | 'revenue'
                  })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    color: '#333333',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                >
                  <option value="expense">Expense</option>
                  <option value="revenue">Revenue</option>
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 'bold',
                  color: '#333333',
                  fontSize: '14px'
                }}>
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value
                  })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    color: '#333333',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 'bold',
                  color: '#333333',
                  fontSize: '14px'
                }}>
                  Description
                </label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction,
                    description: e.target.value
                  })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    color: '#333333',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 'bold',
                  color: '#333333',
                  fontSize: '14px'
                }}>
                  Category
                </label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction,
                    category: e.target.value
                  })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    color: '#333333',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                >
                  <option value="">Select a category...</option>
                  <optgroup label="Equipment & Instruments">
                    <option value="Instruments">Instruments</option>
                    <option value="Sound Equipment">Sound Equipment</option>
                    <option value="Recording Equipment">Recording Equipment</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Maintenance & Repairs">Maintenance & Repairs</option>
                  </optgroup>
                  <optgroup label="Performance & Shows">
                    <option value="Venue Rental">Venue Rental</option>
                    <option value="Performance Fees">Performance Fees</option>
                    <option value="Travel & Lodging">Travel & Lodging</option>
                    <option value="Food & Catering">Food & Catering</option>
                    <option value="Show Promotion">Show Promotion</option>
                  </optgroup>
                  <optgroup label="Recording & Production">
                    <option value="Studio Time">Studio Time</option>
                    <option value="Mixing & Mastering">Mixing & Mastering</option>
                    <option value="Distribution">Distribution</option>
                    <option value="Music Videos">Music Videos</option>
                  </optgroup>
                  <optgroup label="Business & Marketing">
                    <option value="Marketing & Advertising">Marketing & Advertising</option>
                    <option value="Website & Social Media">Website & Social Media</option>
                    <option value="Legal & Professional">Legal & Professional</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Business Expenses">Business Expenses</option>
                  </optgroup>
                  <optgroup label="Revenue">
                    <option value="Live Performance">Live Performance</option>
                    <option value="Music Sales">Music Sales</option>
                    <option value="Streaming Revenue">Streaming Revenue</option>
                    <option value="Merchandise Sales">Merchandise Sales</option>
                    <option value="Sponsorship">Sponsorship</option>
                    <option value="Other Revenue">Other Revenue</option>
                  </optgroup>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'end' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#4CAF50',
                    color: '#ffffff',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s ease',
                    boxShadow: '0 2px 4px rgba(76, 175, 80, 0.2)'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#45a049'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#4CAF50'}
                >
                  Add Transaction
                </button>
              </div>
            </form>
          )}

          {/* Transaction Filters */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              color: '#333333', 
              fontWeight: 'bold',
              fontSize: '14px',
              minWidth: '60px'
            }}>
              Filter by:
            </div>
            
            <div style={{ minWidth: '150px' }}>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  color: '#333333',
                  fontSize: '14px'
                }}
              >
                <option value="">All Types</option>
                <option value="expense">Expenses</option>
                <option value="revenue">Revenue</option>
              </select>
            </div>

            <div style={{ minWidth: '200px' }}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  color: '#333333',
                  fontSize: '14px'
                }}
              >
                <option value="">All Categories</option>
                <optgroup label="Equipment & Instruments">
                  <option value="Instruments">Instruments</option>
                  <option value="Sound Equipment">Sound Equipment</option>
                  <option value="Recording Equipment">Recording Equipment</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Maintenance & Repairs">Maintenance & Repairs</option>
                </optgroup>
                <optgroup label="Performance & Shows">
                  <option value="Venue Rental">Venue Rental</option>
                  <option value="Performance Fees">Performance Fees</option>
                  <option value="Travel & Lodging">Travel & Lodging</option>
                  <option value="Food & Catering">Food & Catering</option>
                  <option value="Show Promotion">Show Promotion</option>
                </optgroup>
                <optgroup label="Recording & Production">
                  <option value="Studio Time">Studio Time</option>
                  <option value="Mixing & Mastering">Mixing & Mastering</option>
                  <option value="Distribution">Distribution</option>
                  <option value="Music Videos">Music Videos</option>
                </optgroup>
                <optgroup label="Business & Marketing">
                  <option value="Marketing & Advertising">Marketing & Advertising</option>
                  <option value="Website & Social Media">Website & Social Media</option>
                  <option value="Legal & Professional">Legal & Professional</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Business Expenses">Business Expenses</option>
                </optgroup>
                <optgroup label="Revenue">
                  <option value="Live Performance">Live Performance</option>
                  <option value="Music Sales">Music Sales</option>
                  <option value="Streaming Revenue">Streaming Revenue</option>
                  <option value="Merchandise Sales">Merchandise Sales</option>
                  <option value="Sponsorship">Sponsorship</option>
                  <option value="Other Revenue">Other Revenue</option>
                </optgroup>
              </select>
            </div>

            {(categoryFilter || typeFilter) && (
              <button
                onClick={() => {
                  setCategoryFilter('')
                  setTypeFilter('')
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#5a6268'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#6c757d'}
              >
                Clear Filters
              </button>
            )}

            <div style={{ 
              color: '#666666', 
              fontSize: '14px',
              marginLeft: 'auto'
            }}>
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>
          </div>

          {/* Transactions List */}
          <div style={{ 
            overflowX: 'auto',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              backgroundColor: '#ffffff'
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: '#f8f9fa',
                  borderBottom: '2px solid #dee2e6'
                }}>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    borderBottom: '2px solid #dee2e6'
                  }}>Date</th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    borderBottom: '2px solid #dee2e6'
                  }}>Type</th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    borderBottom: '2px solid #dee2e6'
                  }}>Amount</th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    borderBottom: '2px solid #dee2e6'
                  }}>Description</th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    borderBottom: '2px solid #dee2e6'
                  }}>Category</th>
                                    <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    borderBottom: '2px solid #dee2e6'
                  }}>Added By</th>
                  {(session.user as any).role === 'ADMIN' && (
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'center', 
                      color: '#333333',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      borderBottom: '2px solid #dee2e6'
                    }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr key={transaction.id} style={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#f0f8ff'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9'}
                  >
                    <td style={{ 
                      padding: '1rem', 
                      borderBottom: '1px solid #e0e0e0',
                      color: '#333333',
                      fontSize: '14px'
                    }}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      borderBottom: '1px solid #e0e0e0',
                      color: '#333333',
                      fontSize: '14px'
                    }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        backgroundColor: transaction.type === 'revenue' ? '#d4edda' : '#f8d7da',
                        color: transaction.type === 'revenue' ? '#155724' : '#721c24',
                        border: `1px solid ${transaction.type === 'revenue' ? '#c3e6cb' : '#f5c6cb'}`
                      }}>
                        {transaction.type}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      borderBottom: '1px solid #e0e0e0',
                      color: transaction.type === 'revenue' ? '#28a745' : '#dc3545',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      borderBottom: '1px solid #e0e0e0',
                      color: '#333333',
                      fontSize: '14px'
                    }}>
                      {transaction.description}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      borderBottom: '1px solid #e0e0e0',
                      color: '#555555',
                      fontSize: '14px',
                      fontStyle: 'italic'
                    }}>
                      {transaction.category}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      borderBottom: '1px solid #e0e0e0',
                      color: '#666666',
                      fontSize: '14px'
                    }}>
                      {transaction.addedBy}
                    </td>
                    {(session.user as any).role === 'ADMIN' && (
                      <td style={{ 
                        padding: '1rem', 
                        borderBottom: '1px solid #e0e0e0',
                        textAlign: 'center'
                      }}>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            padding: '0.4rem 0.8rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#13477B', marginBottom: '1rem' }}>Quick Actions</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <button
              onClick={() => window.open('https://drive.google.com/drive/folders/1-9V07aBQHelMa1bdE4Im81xr17LQm8Rx?usp=drive_link', '_blank')}
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                padding: '1rem',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              📅 View Calendar
            </button>
            <button
              onClick={() => setShowFileManager(!showFileManager)}
              style={{
                backgroundColor: showFileManager ? '#4C1D95' : '#6f42c1',
                color: 'white',
                padding: '1rem',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              📁 {showFileManager ? 'Hide Files' : 'Band Files'}
            </button>
            {(session.user as any).role === 'ADMIN' && (
              <button
                onClick={() => setShowEmailManager(!showEmailManager)}
                style={{
                  backgroundColor: showEmailManager ? '#9333ea' : '#a855f7',
                  color: 'white',
                  padding: '1rem',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                📧 {showEmailManager ? 'Hide Email Manager' : 'Email Campaigns'}
              </button>
            )}
            <button
              onClick={() => window.open('/', '_blank')}
              style={{
                backgroundColor: '#13477B',
                color: 'white',
                padding: '1rem',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              🏠 Public Site
            </button>
          </div>
        </div>

        {/* File Manager Section */}
        {showFileManager && (
          <div style={{ marginTop: '2rem' }}>
            <FileManager />
          </div>
        )}

        {/* Email Campaign Manager Section */}
        {showEmailManager && (
          <div style={{ marginTop: '2rem' }}>
            <EmailCampaignManager />
          </div>
        )}
      </div>
    </div>
    </DashboardEntrance>
  )
}