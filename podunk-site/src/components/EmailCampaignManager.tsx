'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Subscriber {
  id: string
  email: string
  name: string | null
  subscribedAt: string
}

interface EmailCampaign {
  id: string
  subject: string
  content: string
  plainText: string | null
  status: 'DRAFT' | 'SENT' | 'FAILED'
  sentAt: string | null
  recipientCount: number | null
  createdAt: string
  sender: {
    name: string
    username: string
  } | null
}

export default function EmailCampaignManager() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'campaigns' | 'subscribers' | 'compose'>('campaigns')
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(false)
  
  // Compose form state
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null)

  useEffect(() => {
    if ((session?.user as any)?.role === 'ADMIN') {
      fetchCampaigns()
      fetchSubscribers()
    }
  }, [session])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/email-campaigns')
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data)
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    }
  }

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/mailing-list')
      if (response.ok) {
        const data = await response.json()
        setSubscribers(data)
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error)
    }
  }

  const handleSaveCampaign = async () => {
    if (!subject.trim() || !content.trim()) {
      alert('Subject and content are required')
      return
    }

    setLoading(true)
    try {
      const url = editingCampaign ? '/api/email-campaigns' : '/api/email-campaigns'
      const method = editingCampaign ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingCampaign?.id,
          subject: subject.trim(),
          content: content.trim()
        })
      })

      if (response.ok) {
        await fetchCampaigns()
        setSubject('')
        setContent('')
        setEditingCampaign(null)
        setActiveTab('campaigns')
        alert(editingCampaign ? 'Campaign updated!' : 'Campaign saved as draft!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save campaign')
      }
    } catch (error) {
      alert('An error occurred while saving')
    } finally {
      setLoading(false)
    }
  }

  const handleSendCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this email to all subscribers? This cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/email-campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send',
          campaignId
        })
      })

      if (response.ok) {
        const data = await response.json()
        await fetchCampaigns()
        alert(data.message)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to send campaign')
      }
    } catch (error) {
      alert('An error occurred while sending')
    } finally {
      setLoading(false)
    }
  }

  const handleEditCampaign = (campaign: EmailCampaign) => {
    setEditingCampaign(campaign)
    setSubject(campaign.subject)
    setContent(campaign.content)
    setActiveTab('compose')
  }

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) {
      return
    }

    try {
      const response = await fetch(`/api/email-campaigns?id=${campaignId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchCampaigns()
        alert('Campaign deleted!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete campaign')
      }
    } catch (error) {
      alert('An error occurred while deleting')
    }
  }

  if ((session?.user as any)?.role !== 'ADMIN') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Admin access required</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT': return '#10B981'
      case 'DRAFT': return '#F59E0B'
      case 'FAILED': return '#EF4444'
      default: return '#6B7280'
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: 'white' }}>
        📧 Email Campaign Manager
      </h1>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #E5E7EB',
        marginBottom: '2rem'
      }}>
        {[
          { key: 'campaigns', label: '📋 Campaigns', count: campaigns.length },
          { key: 'subscribers', label: '👥 Subscribers', count: subscribers.length },
          { key: 'compose', label: '✍️ Compose' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              color: activeTab === tab.key ? '#F9A72A' : 'white',
              borderBottom: activeTab === tab.key ? '2px solid #F9A72A' : 'none',
              transition: 'color 0.2s'
            }}
          >
            {tab.label} {tab.count !== undefined && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>
              Email Campaigns
            </h2>
            <button
              onClick={() => {
                setEditingCampaign(null)
                setSubject('')
                setContent('')
                setActiveTab('compose')
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#F9A72A',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              + New Campaign
            </button>
          </div>

          {campaigns.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#6B7280'
            }}>
              <p>No campaigns created yet. Create your first email campaign!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                        {campaign.subject}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>
                        <span style={{
                          backgroundColor: getStatusColor(campaign.status),
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {campaign.status}
                        </span>
                        <span>Created: {formatDate(campaign.createdAt)}</span>
                        {campaign.sentAt && <span>Sent: {formatDate(campaign.sentAt)}</span>}
                        {campaign.recipientCount && <span>Recipients: {campaign.recipientCount}</span>}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {campaign.status === 'DRAFT' && (
                        <>
                          <button
                            onClick={() => handleEditCampaign(campaign)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#3B82F6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.875rem',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleSendCampaign(campaign.id)}
                            disabled={loading}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: loading ? '#9CA3AF' : '#10B981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.875rem',
                              cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                          >
                            Send
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#EF4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.875rem',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: '#F9FAFB',
                    padding: '1rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    color: '#374151',
                    maxHeight: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    <div dangerouslySetInnerHTML={{ __html: campaign.content.substring(0, 200) + '...' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
            Mailing List Subscribers ({subscribers.length})
          </h2>

          {subscribers.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#6B7280'
            }}>
              <p>No subscribers yet. Add the mailing list signup to your website!</p>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#F9FAFB',
                borderBottom: '1px solid #E5E7EB',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: '#374151'
              }}>
                <div>Name</div>
                <div>Email</div>
                <div>Subscribed</div>
              </div>
              
              {subscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: '1rem',
                    padding: '1rem',
                    borderBottom: '1px solid #F3F4F6',
                    fontSize: '0.9rem'
                  }}
                >
                  <div style={{ color: '#374151' }}>
                    {subscriber.name || 'Anonymous'}
                  </div>
                  <div style={{ color: '#6B7280' }}>
                    {subscriber.email}
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>
                    {formatDate(subscriber.subscribedAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Compose Tab */}
      {activeTab === 'compose' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
            {editingCampaign ? 'Edit Campaign' : 'Compose New Email'}
          </h2>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: 'white', marginBottom: '0.5rem' }}>
                Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  color: '#1F2937'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: 'white', marginBottom: '0.5rem' }}>
                Email Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your email content here..."
                rows={12}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  backgroundColor: 'white',
                  color: '#1F2937'
                }}
              />
              <p style={{ fontSize: '0.8rem', color: 'white', marginTop: '0.5rem', opacity: 0.8 }}>
                You can use basic HTML tags for formatting.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleSaveCampaign}
                disabled={loading}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: loading ? '#9CA3AF' : '#F9A72A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Saving...' : (editingCampaign ? 'Update Campaign' : 'Save as Draft')}
              </button>
              
              {editingCampaign && (
                <button
                  onClick={() => {
                    setEditingCampaign(null)
                    setSubject('')
                    setContent('')
                  }}
                  style={{
                    padding: '1rem 2rem',
                    backgroundColor: '#6B7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}