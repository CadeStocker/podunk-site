import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"
import { db } from "@/lib/prisma"

// Initialize database on server start
db.initializeDatabase().catch(console.error)

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Band Member Login",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          // Convert email to lowercase for consistent searching
          const email = credentials.username.toLowerCase()
          const user = await db.findUserByEmail(email)

          if (!user) {
            return null
          }

          // Check if user is approved
          if (user.status !== 'APPROVED') {
            console.log(`Login attempt by ${user.email} with status: ${user.status}`)
            return null
          }

          const passwordMatch = await db.verifyPassword(user, credentials.password)

          if (!passwordMatch) {
            return null
          }

          // Update last login
          await db.updateUserLastLogin(user.id)

          return {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).username = token.username as string;
        (session.user as any).role = token.role as string;
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  }
}

export default NextAuth(authOptions)