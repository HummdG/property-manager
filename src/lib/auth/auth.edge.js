/**
 * Edge-compatible auth configuration
 * This config can run in Edge Runtime (middleware) because it doesn't import:
 * - Prisma/database modules
 * - bcrypt or other Node.js native modules
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl
      const session = auth

      const publicPrefixes = ['/login', '/register', '/api/auth', '/properties', '/api/public']
      const apiRoutes = ['/api/']

      const roleRoutes = {
        OWNER: ['/owner'],
        TENANT: ['/tenant'],
        TRADER: ['/trader'],
        ADMIN: ['/admin', '/owner', '/tenant', '/trader']
      }

      // Allow root path
      if (pathname === '/') {
        return true
      }

      // Allow public routes
      const isPublicRoute = publicPrefixes.some(route => pathname.startsWith(route))
      if (isPublicRoute) {
        return true
      }

      // Allow API routes through - they handle their own auth
      const isApiRoute = apiRoutes.some(route => pathname.startsWith(route))
      if (isApiRoute) {
        return true
      }

      // Require authentication for all other routes
      if (!session?.user) {
        return false
      }

      // Check role-based access
      const userRole = session.user.role
      const allowedRoutes = roleRoutes[userRole] || []
      const hasAccess = allowedRoutes.some(route => pathname.startsWith(route))

      if (!hasAccess && pathname !== '/') {
        // User authenticated but lacks permission - will be handled by redirect
        return false
      }

      return true
    },
  },
  trustHost: true,
}

