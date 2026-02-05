import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const publicPrefixes = ['/login', '/register', '/api/auth', '/properties', '/api/public']
const apiRoutes = ['/api/']

const roleRoutes = {
  OWNER: ['/owner'],
  TENANT: ['/tenant'],
  TRADER: ['/trader'],
  ADMIN: ['/admin', '/owner', '/tenant', '/trader']
}

function getDashboardForRole(role) {
  const paths = {
    ADMIN: '/admin',
    OWNER: '/owner',
    TENANT: '/tenant',
    TRADER: '/trader'
  }
  return paths[role] || '/owner'
}

export async function middleware(req) {
  const { nextUrl } = req
  const pathname = nextUrl.pathname

  // Get token using next-auth/jwt (Edge compatible)
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })

  // Allow root path
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Allow public routes
  const isPublicRoute = publicPrefixes.some(route => pathname.startsWith(route))
  if (isPublicRoute) {
    // If logged in and trying to access auth pages, redirect to dashboard
    if (token && (pathname === '/login' || pathname === '/register')) {
      const dashboardPath = getDashboardForRole(token.role)
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
  if (!token) {
    const loginUrl = new URL('/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access
  const userRole = token.role
  const allowedRoutes = roleRoutes[userRole] || []
  const hasAccess = allowedRoutes.some(route => pathname.startsWith(route))

  if (!hasAccess && pathname !== '/') {
    // Redirect to user's dashboard if they don't have access
    const dashboardPath = getDashboardForRole(userRole)
    return NextResponse.redirect(new URL(dashboardPath, nextUrl))
  }

  return NextResponse.next()
}

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
