import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { auth } from './auth'

export async function middleware(req: NextRequest) {
  const session = await auth()
  const isAuth = !!session
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth/login') || 
                     req.nextUrl.pathname.startsWith('/auth/register')
  const isAdminRoute = req.nextUrl.pathname.startsWith('/building') || 
                       req.nextUrl.pathname.startsWith('/tenants') ||
                       req.nextUrl.pathname.startsWith('/contracts') ||
                       req.nextUrl.pathname.startsWith('/maintenance') ||
                       req.nextUrl.pathname.startsWith('/inventory') ||
                       req.nextUrl.pathname.startsWith('/sub-contracts') ||
                       req.nextUrl.pathname.startsWith('/notifications') ||
                       req.nextUrl.pathname.startsWith('/users') ||
                       req.nextUrl.pathname === '/'
  const isTenantRoute = req.nextUrl.pathname.startsWith('/tenant')
  
  // Get user role from session
  const userRole = session?.user?.role || 'tenant'
  
  // If the user is on an auth page and is already logged in
  if (isAuthPage) {
    if (isAuth) {
      // Redirect admin to admin dashboard
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/', req.url))
      }
      // Redirect tenant to tenant dashboard
      return NextResponse.redirect(new URL('/tenant', req.url))
    }
    return null
  }

  // If the user is not authenticated and not on an auth page
  if (!isAuth && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // If admin tries to access tenant routes
  if (isAuth && userRole === 'admin' && isTenantRoute) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // If tenant tries to access admin routes
  if (isAuth && userRole === 'tenant' && isAdminRoute) {
    return NextResponse.redirect(new URL('/tenant', req.url))
  }

  return null
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/',
    '/auth/login',
    '/auth/register',
    '/building/:path*',
    '/tenants/:path*',
    '/contracts/:path*',
    '/maintenance/:path*',
    '/inventory/:path*',
    '/sub-contracts/:path*',
    '/notifications/:path*',
    '/users/:path*',
    '/tenant/:path*',
  ],
}
