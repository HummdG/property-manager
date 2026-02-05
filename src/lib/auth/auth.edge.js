/**
 * Edge-compatible auth configuration
 * Contains only the basic config without database adapters or Node.js modules
 */

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
  trustHost: true,
}
