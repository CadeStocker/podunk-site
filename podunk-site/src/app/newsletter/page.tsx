'use client'

import MailingListSignup from '@/components/MailingListSignup'

export default function NewsletterPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 900 }}>
          Stay Connected
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem', lineHeight: 1.6 }}>
          Join the Podunk Ramblers community and get updates on the band, merch, and much more.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(249, 167, 42, 0.1) 0%, rgba(19, 71, 123, 0.1) 100%)',
          borderRadius: '12px',
          border: '2px solid #F9A72A'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎵</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#F9A72A' }}>
            New Releases
          </h3>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
            Be the first to hear about our latest music drops.
          </p>
        </div>

        <div style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(249, 167, 42, 0.1) 0%, rgba(19, 71, 123, 0.1) 100%)',
          borderRadius: '12px',
          border: '2px solid #F9A72A'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎪</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#F9A72A' }}>
            Upcoming Shows
          </h3>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
            Never miss a show! Get notified about show dates and events near you.
          </p>
        </div>

        <div style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(249, 167, 42, 0.1) 0%, rgba(19, 71, 123, 0.1) 100%)',
          borderRadius: '12px',
          border: '2px solid #F9A72A'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎸</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#F9A72A' }}>
            Band Updates
          </h3>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
            Stay in the loop with behind-the-scenes stories and band news.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <MailingListSignup compact={false} />
      </div>

      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        background: 'rgba(249, 167, 42, 0.05)',
        border: '1px solid rgba(249, 167, 42, 0.3)',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.8)' }}>
          We respect your privacy and keep your data secure. You can unsubscribe at any time with a single click. No spam, just good music! 🎵
        </p>
      </div>
    </main>
  )
}
