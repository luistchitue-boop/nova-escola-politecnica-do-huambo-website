import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '../../../lib/db'
import { adminUsers } from '../../../db/schema'

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || '').trim().toLowerCase()
        const password = String(credentials?.password || '')

        if (!email || !password) {
          return null
        }

        try {
          const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1)

          if (!user) {
            return null
          }

          const passwordMatches = await bcrypt.compare(password, user.passwordHash)

          if (!passwordMatches) {
            return null
          }

          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            role: user.role || 'admin',
          }
        } catch (error) {
          console.error('Admin auth lookup failed:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role || 'admin'
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
