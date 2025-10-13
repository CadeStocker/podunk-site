import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '../../lib/prisma'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

// Disable default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
}

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    console.log('Files API - Session user:', session.user)

  if (req.method === 'GET') {
    try {
      // Get pagination parameters from query
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const category = req.query.category as string
      
      // Calculate offset for pagination
      const skip = (page - 1) * limit
      
      // Build where clause for filtering
      const where: any = {}
      if (category && category !== 'all') {
        where.category = category
      }
      
      // Get total count for pagination info
      const totalFiles = await prisma.file.count({ where })
      
      // Get paginated files
      const files = await prisma.file.findMany({
        where,
        include: {
          uploader: {
            select: {
              name: true,
              username: true,
            },
          },
        },
        orderBy: {
          uploadedAt: 'desc',
        },
        skip,
        take: limit,
      })

      return res.status(200).json({
        files,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalFiles / limit),
          totalFiles,
          hasNextPage: page < Math.ceil(totalFiles / limit),
          hasPreviousPage: page > 1,
        }
      })
    } catch (error) {
      console.error('Error fetching files:', error)
      return res.status(500).json({ error: 'Failed to fetch files' })
    }
  }

  if (req.method === 'POST') {
    try {
      const form = formidable({
        uploadDir: UPLOAD_DIR,
        keepExtensions: true,
        maxFileSize: 50 * 1024 * 1024, // 50MB limit
      })

      const [fields, files] = await form.parse(req)
      
      const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file
      const category = Array.isArray(fields.category) ? fields.category[0] : fields.category
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description

      if (!uploadedFile) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      // Get file info
      const stats = fs.statSync(uploadedFile.filepath)
      const fileExtension = path.extname(uploadedFile.originalFilename || '')
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`
      const newFilePath = path.join(UPLOAD_DIR, fileName)

      // Move file to permanent location
      fs.renameSync(uploadedFile.filepath, newFilePath)

      let userId = (session.user as any).id
      console.log('Session user ID:', userId)

      // Fallback: get user ID from database if not in session
      if (!userId) {
        const username = (session.user as any).username
        if (username) {
          const user = await prisma.user.findUnique({ where: { username } })
          userId = user?.id
          console.log('Retrieved user ID from database:', userId)
        }
      }

      if (!userId) {
        return res.status(400).json({ error: 'User ID not found in session or database' })
      }

      // Save file info to database
      const fileRecord = await prisma.file.create({
        data: {
          name: fileName,
          originalName: uploadedFile.originalFilename || 'unknown',
          mimeType: uploadedFile.mimetype || 'application/octet-stream',
          size: stats.size,
          category: category || 'general',
          description: description || null,
          filePath: newFilePath,
          uploadedBy: userId,
        },
        include: {
          uploader: {
            select: {
              name: true,
              username: true,
            },
          },
        },
      })

      return res.status(201).json(fileRecord)
    } catch (error) {
      console.error('Error uploading file:', error)
      return res.status(500).json({ error: 'Failed to upload file' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'File ID required' })
      }

      // Get file record
      const fileRecord = await prisma.file.findUnique({
        where: { id },
      })

      if (!fileRecord) {
        return res.status(404).json({ error: 'File not found' })
      }

      // Check if user can delete (owner or admin)
      const canDelete = 
        fileRecord.uploadedBy === (session.user as any).id ||
        (session.user as any).role === 'ADMIN'

      if (!canDelete) {
        return res.status(403).json({ error: 'Not authorized to delete this file' })
      }

      // Delete physical file
      if (fs.existsSync(fileRecord.filePath)) {
        fs.unlinkSync(fileRecord.filePath)
      }

      // Delete database record
      await prisma.file.delete({
        where: { id },
      })

      return res.status(200).json({ message: 'File deleted successfully' })
    } catch (error) {
      console.error('Error deleting file:', error)
      return res.status(500).json({ error: 'Failed to delete file' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Files API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}