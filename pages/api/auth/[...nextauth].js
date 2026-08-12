import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'direccao@escola.ao'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export default NextAuth({
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

        if (email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
          return {
            id: 'admin',
            name: 'Direção',
            email,
            role: 'admin',
          }
        }

        return null
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
  secret: process.env.NEXTAUTH_SECRET || 'change-me-in-production',
})
