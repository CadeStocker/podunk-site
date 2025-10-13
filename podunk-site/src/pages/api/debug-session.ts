import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { db } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const sessionUser = session.user as any
    console.log('Session user:', sessionUser)
    
    const dbUser = await db.findUserByUsername(sessionUser.username)
    console.log('Database user found:', dbUser ? {
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
      role: dbUser.role
    } : 'null')

    return res.status(200).json({
      sessionUser: sessionUser,
      dbUser: dbUser ? {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.role
      } : null,
      sessionInfo: {
        hasId: !!sessionUser?.id,
        hasUsername: !!sessionUser?.username,
        hasRole: !!sessionUser?.role,
        idValue: sessionUser?.id,
        usernameValue: sessionUser?.username,
        roleValue: sessionUser?.role,
      },
      session: {
        username: sessionUser.username,
        name: sessionUser.name,
        email: sessionUser.email,
        role: sessionUser.role
      },
      database: dbUser ? {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.role
      } : null
    })
  } catch (error) {
    console.error('Error in debug session:', error)
    return res.status(500).json({ error: 'Failed to debug session' })
  }
}