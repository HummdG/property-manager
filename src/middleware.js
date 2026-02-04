import { auth } from '@/lib/auth/config'
import { NextResponse } from 'next/server'

const publicRoutes = ['/login', '/register', '/api/auth', '/properties', '/api/public']
const apiRoutes = ['/api/']  // API routes handle their own auth

const roleRoutes = {
  OWNER: ['/owner'],
  TENANT: ['/tenant'],
  TRADER: ['/trader'],
  ADMIN: ['/admin', '/owner', '/tenant', '/trader'] // Admin can access all
}

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const pathname = nextUrl.pathname

  // Allow public routes
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  if (isPublicRoute) {
    // If logged in and trying to access auth pages, redirect to dashboard
    if (session?.user && (pathname === '/login' || pathname === '/register')) {
      const dashboardPath = getDashboardForRole(session.user.role)
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
  if (!session?.user) {
    const loginUrl = new URL('/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access
  const userRole = session.user.role
  const allowedRoutes = roleRoutes[userRole] || []
  const hasAccess = allowedRoutes.some(route => pathname.startsWith(route))

  if (!hasAccess && pathname !== '/') {
    // Redirect to user's dashboard if they don't have access
    const dashboardPath = getDashboardForRole(userRole)
    return NextResponse.redirect(new URL(dashboardPath, nextUrl))
  }

  return NextResponse.next()
})

function getDashboardForRole(role) {
  const paths = {
    ADMIN: '/admin',
    OWNER: '/owner',
    TENANT: '/tenant',
    TRADER: '/trader'
  }
  return paths[role] || '/owner'
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes that don't need protection
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}

