'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import ToneBrothersEasterEgg from '../../components/ToneBrothersEasterEgg'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showToneBrothersEasterEgg, setShowToneBrothersEasterEgg] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    getSession().then(session => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        
        // Check if this is one of the Tone Brothers for easter egg
        const username = formData.username.toLowerCase()
        if (username.includes('sutton') || username.includes('thomas') || username.includes('tj')) {
          setShowToneBrothersEasterEgg(true)
        } else {
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        }
      } else {
        setError(data.error || 'Failed to create account')
      }
    } catch (error) {
      setError('An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  const handleToneBrothersComplete = () => {
    setShowToneBrothersEasterEgg(false)
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  }

  if (success) {
    return (
      <>
        {showToneBrothersEasterEgg && (
          <ToneBrothersEasterEgg 
            username={formData.username}
            onComplete={handleToneBrothersComplete}
          />
        )}
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
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '1.5rem',
              borderRadius: '5px',
              marginBottom: '1rem',
              border: '1px solid #ffeaa7'
            }}>
              <h2 style={{ margin: '0 0 1rem 0', color: '#856404' }}>Account Created Successfully! 🎸</h2>
              <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                <p style={{ margin: '0 0 0.5rem 0' }}><strong>Next Steps:</strong></p>
                <p style={{ margin: '0 0 0.5rem 0' }}>1. Your account is pending admin approval</p>
                <p style={{ margin: '0 0 0.5rem 0' }}>2. An admin will review and approve your request</p>
                <p style={{ margin: '0 0 0.5rem 0' }}>3. You'll be able to log in once approved</p>
              </div>
              <p style={{ margin: 0, fontStyle: 'italic' }}>Please wait for approval before attempting to log in.</p>
            </div>
          </div>
        </div>
      </>
    )
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
            Join the Band
          </h1>
          <p style={{ color: '#666' }}>Create your Podunk Ramblers account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: '500'
            }}>
              Full Name
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Your full name"
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
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="(555) 123-4567"
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Minimum 8 characters"
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
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem',
          fontSize: '0.9rem'
        }}>
          <span style={{ color: '#666' }}>Already have an account? </span>
          <Link 
            href="/login" 
            style={{ 
              color: '#13477B', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  )
}