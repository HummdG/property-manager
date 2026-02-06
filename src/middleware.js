import { NextResponse } from 'next/server'
import { authMiddleware } from '@/lib/auth/auth.edge'

const publicPrefixes = ['/login', '/register', '/api/auth', '/properties', '/api/public', '/services']
const apiRoutes = ['/api/']

const roleRoutes = {
  OWNER: ['/owner'],
  TENANT: ['/tenant'],
  TRADER: ['/trader'],
  AGENT: ['/agent'],
  ADMIN: ['/admin', '/owner', '/tenant', '/trader', '/agent']
}

function getDashboardForRole(role) {
  const paths = {
    ADMIN: '/admin',
    OWNER: '/owner',
    TENANT: '/tenant',
    TRADER: '/trader',
    AGENT: '/agent'
  }
  return paths[role] || '/owner'
}

export default authMiddleware((req) => {
  const { nextUrl } = req
  const pathname = nextUrl.pathname
  const session = req.auth

  // Allow root path
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Allow public routes
  const isPublicRoute = publicPrefixes.some(route => pathname.startsWith(route))
  if (isPublicRoute) {
    // If logged in and trying to access auth pages, redirect to dashboard
    if (session && (pathname === '/login' || pathname === '/register')) {
      const dashboardPath = getDashboardForRole(session.user?.role)
      return NextResponse.redirect(new URL(dashboardPath, nextUrl))
    }
    return NextResponse.next()
  }

  // Allow API routes through - they handle their own auth
  const isApiRoute = apiRoutes.some(route => pathname.startsWith(route))
  if (isApiRoute) {
    return NextResponse.next()
  }

  // Require authentication for all other routes
  if (!session) {
    const loginUrl = new URL('/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access
  const userRole = session.user?.role
  const allowedRoutes = roleRoutes[userRole] || []
  const hasAccess = allowedRoutes.some(route => pathname.startsWith(route))

  if (!hasAccess && pathname !== '/') {
    // Redirect to user's dashboard if they don't have access
    const dashboardPath = getDashboardForRole(userRole)
    return NextResponse.redirect(new URL(dashboardPath, nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
