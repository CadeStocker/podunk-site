'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface FileData {
  id: string
  name: string
  originalName: string
  mimeType: string
  size: number
  category?: string
  description?: string
  uploadedAt: string
  uploader: {
    name: string
    username: string
  }
}

interface PaginationData {
  currentPage: number
  totalPages: number
  totalFiles: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface FilesResponse {
  files: FileData[]
  pagination: PaginationData
}

export default function FileManager() {
  const { data: session } = useSession()
  const [files, setFiles] = useState<FileData[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterCategory, setFilterCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [category, setCategory] = useState('general')
  const [description, setDescription] = useState('')

  const fetchFiles = async (page = 1, categoryFilter = 'all') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      })
      
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter)
      }
      
      const response = await fetch(`/api/files?${params}`)
      if (response.ok) {
        const data: FilesResponse = await response.json()
        setFiles(data.files)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles(currentPage, filterCategory)
  }, [currentPage, filterCategory])

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      alert('Please select a file to upload')
      return
    }

    if (!session?.user) {
      alert('You must be logged in to upload files')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('category', category)
      formData.append('description', description)

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        // Reset form
        setSelectedFile(null)
        setDescription('')
        setCategory('general')
        
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        
        // Refresh the current page to show the new file
        await fetchFiles(currentPage, filterCategory)
      } else {
        console.error('Upload failed with status:', response.status)
        console.error('Response headers:', response.headers)
        const responseText = await response.text()
        console.error('Response body:', responseText)
        
        try {
          const error = JSON.parse(responseText)
          alert(`Upload failed: ${error.error}`)
        } catch (parseError) {
          alert(`Upload failed: Server returned HTML instead of JSON. Status: ${response.status}`)
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/files?id=${fileId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Refresh the current page after deletion
        await fetchFiles(currentPage, filterCategory)
      } else {
        const error = await response.json()
        alert(`Delete failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Delete failed')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return '🖼️'
    if (mimeType.startsWith('audio/')) return '🎵'
    if (mimeType.startsWith('video/')) return '🎥'
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊'
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📈'
    return '📁'
  }

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'sheet-music': return '#8B5CF6'
      case 'recordings': return '#EF4444'
      case 'documents': return '#3B82F6'
      case 'photos': return '#10B981'
      default: return '#6B7280'
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading files...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>
          📁 Band Files
        </h1>
        <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
          Share sheet music, recordings, and other band-related files
        </p>

        {/* Upload Form */}
        <div style={{
          backgroundColor: '#F9FAFB',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
            Upload New File
          </h2>
          
          <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Select File
                </label>
                <input
                  id="file-input"
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    backgroundColor: 'white',
                    color: '#374151'
                  }}
                  required
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    backgroundColor: 'white',
                    color: '#374151'
                  }}
                >
                  <option value="general">General</option>
                  <option value="sheet-music">Sheet Music</option>
                  <option value="recordings">Recordings</option>
                  <option value="documents">Documents</option>
                  <option value="photos">Photos</option>
                </select>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Description (optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for this file..."
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  backgroundColor: 'white',
                  color: '#374151'
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              style={{
                backgroundColor: uploading ? '#9CA3AF' : '#3B82F6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: uploading ? 'not-allowed' : 'pointer',
                alignSelf: 'flex-start'
              }}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </form>
        </div>

        {/* Files List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#374151', margin: 0 }}>
              Files {pagination && `(${pagination.totalFiles} total)`}
            </h2>
            
            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value)
                setCurrentPage(1) // Reset to first page when filtering
              }}
              style={{
                padding: '0.5rem',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '0.9rem',
                backgroundColor: 'white',
                color: '#374151'
              }}
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="sheet-music">Sheet Music</option>
              <option value="recordings">Recordings</option>
              <option value="documents">Documents</option>
              <option value="photos">Photos</option>
            </select>
          </div>
          
          {files.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#6B7280'
            }}>
              <p>No files uploaded yet. Upload the first file above!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {files.map((file) => (
                <div
                  key={file.id}
                  style={{
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <span style={{ fontSize: '1.5rem' }}>{getFileIcon(file.mimeType)}</span>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: 0 }}>
                          {file.originalName}
                        </h3>
                        {file.category && (
                          <span style={{
                            backgroundColor: getCategoryColor(file.category),
                            color: 'white',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {file.category}
                          </span>
                        )}
                      </div>
                      
                      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        {formatFileSize(file.size)} • Uploaded by {file.uploader.name} • {new Date(file.uploadedAt).toLocaleDateString()}
                      </div>
                      
                      {file.description && (
                        <div style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.25rem' }}>
                          {file.description}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => window.open(`/api/files/${file.id}`, '_blank')}
                      style={{
                        backgroundColor: '#10B981',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      View
                    </button>
                    
                    {(session?.user as any)?.role === 'ADMIN' || file.uploader.username === (session?.user as any)?.username ? (
                      <button
                        onClick={() => handleDeleteFile(file.id, file.originalName)}
                        style={{
                          backgroundColor: '#EF4444',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '2rem',
              padding: '1rem'
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={!pagination.hasPreviousPage}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  backgroundColor: pagination.hasPreviousPage ? 'white' : '#F3F4F6',
                  color: pagination.hasPreviousPage ? '#374151' : '#9CA3AF',
                  cursor: pagination.hasPreviousPage ? 'pointer' : 'not-allowed',
                  fontSize: '0.875rem'
                }}
              >
                Previous
              </button>
              
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      backgroundColor: page === pagination.currentPage ? '#3B82F6' : 'white',
                      color: page === pagination.currentPage ? 'white' : '#374151',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      minWidth: '2.5rem'
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                disabled={!pagination.hasNextPage}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  backgroundColor: pagination.hasNextPage ? 'white' : '#F3F4F6',
                  color: pagination.hasNextPage ? '#374151' : '#9CA3AF',
                  cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed',
                  fontSize: '0.875rem'
                }}
              >
                Next
              </button>
              
              <div style={{ marginLeft: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}