/**
 * Edge-compatible auth configuration
 * Contains only the basic config without database adapters or Node.js modules
 * Used by middleware to read JWT sessions without requiring Prisma
 */
import NextAuth from 'next-auth'

export const authEdgeConfig = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/auth/error',
  },
  providers: [],
  callbacks: {
    async jwt({ token }) {
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  trustHost: true,
}

export const { auth: authMiddleware } = NextAuth(authEdgeConfig)
