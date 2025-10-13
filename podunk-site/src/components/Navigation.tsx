'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'

export default function Navigation() {
  const { data: session, status } = useSession()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (status === 'loading') {
    return (
      <nav className="site-nav" role="navigation" aria-label="Main">
        <a className="nav-link" href="/music">Music</a>
        <a className="nav-link" href="/calendar">Calendar</a>
        <a className="nav-link" href="/about">About</a>
        <a className="nav-link" href="/contact">Contact</a>
        <span className="nav-link" style={{ opacity: 0.5 }}>Loading...</span>
      </nav>
    )
  }

  return (
    <nav className="site-nav" role="navigation" aria-label="Main">
      <a className="nav-link" href="/music">Music</a>
      <a className="nav-link" href="/calendar">Calendar</a>
      <a className="nav-link" href="/about">About</a>
      <a className="nav-link" href="/contact">Contact</a>
      
      {session ? (
        <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="nav-link"
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: 'inherit',
              textDecoration: 'none',
              padding: '0.5rem 1rem'
            }}
          >
            {session.user?.name || 'User'} ▼
          </button>
          
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              minWidth: '160px',
              zIndex: 1000
            }}>
              <a
                href="/dashboard"
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  color: '#333',
                  textDecoration: 'none',
                  borderBottom: '1px solid #eee'
                }}
                onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#f5f5f5'}
                onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
              >
                📊 Dashboard
              </a>
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' })
                  setShowDropdown(false)
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#dc3545',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 'inherit'
                }}
                onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#f5f5f5'}
                onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
              >
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <a className="nav-link" href="/login">Login</a>
      )}
    </nav>
  )
}