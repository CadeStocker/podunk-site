'use client'

import { useState } from 'react'

interface MailingListSignupProps {
  compact?: boolean
}

export default function MailingListSignup({ compact = false }: MailingListSignupProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/mailing-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || null
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setMessage(data.message)
        setEmail('')
        setName('')
      } else {
        setMessage(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (compact) {
    return (
      <div style={{
        backgroundColor: 'rgba(249, 167, 42, 0.1)',
        border: '2px solid #F9A72A',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '2rem 0'
      }}>
        <h3 style={{ 
          fontSize: '1.2rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          color: 'white',
          textAlign: 'center',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}>
          📧 Stay in the Loop!
        </h3>
        
        {success ? (
          <div style={{
            textAlign: 'center',
            color: 'white',
            fontWeight: '500',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
          }}>
            ✅ {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: loading ? '#9CA3AF' : '#F9A72A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {message && !success && (
              <div style={{
                marginTop: '0.5rem',
                color: 'white',
                fontSize: '0.875rem',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                backgroundColor: 'rgba(220, 38, 38, 0.8)',
                padding: '0.5rem',
                borderRadius: '4px'
              }}>
                {message}
              </div>
            )}
          </form>
        )}
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #E5E7EB',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ 
          fontSize: '1.8rem', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: '#1F2937'
        }}>
          📧 Join Our Mailing List
        </h2>
        <p style={{ 
          color: '#6B7280',
          fontSize: '1rem',
          lineHeight: '1.5'
        }}>
          Get updates on new shows, music releases, and band news!
        </p>
      </div>

      {success ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: '#F0FDF4',
          border: '1px solid #86EFAC',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            color: '#166534',
            marginBottom: '0.5rem'
          }}>
            Welcome to the Family!
          </h3>
          <p style={{ color: '#15803d' }}>{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.9rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '1rem',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#F9A72A'}
              onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.9rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '1rem',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#F9A72A'}
              onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
            />
          </div>

          {message && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '6px',
              color: '#DC2626',
              fontSize: '0.9rem'
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: loading ? '#9CA3AF' : '#F9A72A',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              transform: loading ? 'none' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#E69500'
                e.currentTarget.style.transform = 'scale(1.02)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#F9A72A'
                e.currentTarget.style.transform = 'scale(1)'
              }
            }}
          >
            {loading ? 'Subscribing...' : '🎸 Subscribe to Updates'}
          </button>

          <p style={{ 
            fontSize: '0.8rem', 
            color: '#9CA3AF', 
            textAlign: 'center', 
            marginTop: '1rem',
            lineHeight: '1.4'
          }}>
            We respect your privacy. Unsubscribe at any time.<br />
            No spam, just good music updates! 🎵
          </p>
        </form>
      )}
    </div>
  )
}