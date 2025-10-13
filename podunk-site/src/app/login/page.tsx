'use client'

import { signIn, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    getSession().then(session => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        // Check if this might be a pending approval issue
        try {
          const statusResponse = await fetch('/api/check-user-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: username })
          })
          
          if (statusResponse.ok) {
            const statusData = await statusResponse.json()
            if (statusData.status === 'PENDING') {
              setError('Your account is pending admin approval. Please wait for approval before logging in.')
            } else if (statusData.status === 'REJECTED') {
              setError('Your account has been rejected. Please contact an administrator.')
            } else {
              setError('Invalid username or password')
            }
          } else {
            setError('Invalid username or password')
          }
        } catch {
          setError('Invalid username or password')
        }
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#13477B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            color: '#13477B', 
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            Band Member Login
          </h1>
          <p style={{ color: '#666' }}>Access the Podunk Ramblers dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: '500'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="your.email@gmail.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #ddd',
                borderRadius: '5px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s',
                color: '#333',
                backgroundColor: '#fff'
              }}
              onFocus={(e) => e.target.style.borderColor = '#13477B'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #ddd',
                borderRadius: '5px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s',
                color: '#333',
                backgroundColor: '#fff'
              }}
              onFocus={(e) => e.target.style.borderColor = '#13477B'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '0.75rem',
              borderRadius: '5px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#ccc' : '#13477B',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => {
              if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = '#0f3a63'
            }}
            onMouseOut={(e) => {
              if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = '#13477B'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem',
          fontSize: '0.9rem'
        }}>
          <Link 
            href="/forgot-password" 
            style={{ 
              color: '#13477B', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Forgot your password?
          </Link>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem',
          fontSize: '0.9rem'
        }}>
          <span style={{ color: '#666' }}>Don't have an account? </span>
          <Link 
            href="/signup" 
            style={{ 
              color: '#13477B', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  )
}