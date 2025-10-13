import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '../../../lib/prisma'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'File ID required' })
    }

    // Get file record from database
    const fileRecord = await prisma.file.findUnique({
      where: { id },
    })

    if (!fileRecord) {
      return res.status(404).json({ error: 'File not found' })
    }

    // Check if file exists on disk
    if (!fs.existsSync(fileRecord.filePath)) {
      return res.status(404).json({ error: 'File not found on disk' })
    }

    // Read and serve the file
    const fileBuffer = fs.readFileSync(fileRecord.filePath)
    
    // Set appropriate headers
    res.setHeader('Content-Type', fileRecord.mimeType)
    res.setHeader('Content-Disposition', `inline; filename="${fileRecord.originalName}"`)
    res.setHeader('Content-Length', fileRecord.size.toString())
    
    return res.send(fileBuffer)
  } catch (error) {
    console.error('Error serving file:', error)
    return res.status(500).json({ error: 'Failed to serve file' })
  }
}