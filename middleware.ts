import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Routes that require authentication
const PROTECTED = ['/watchlist', '/favorites', '/my-reviews', '/settings']
// Routes that require admin
const ADMIN_ONLY = ['/admin']
// Routes accessible only when NOT logged in
const AUTH_ONLY = ['/auth/login', '/auth/register']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('tv_token')?.value
  const user = token ? verifyToken(token) : null

  // Redirect logged-in users away from auth pages
  if (AUTH_ONLY.some(p => pathname.startsWith(p)) && user) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Protect authenticated routes
  if (PROTECTED.some(p => pathname.startsWith(p)) && !user) {
    const url = new URL('/auth/login', req.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Protect admin routes
  if (ADMIN_ONLY.some(p => pathname.startsWith(p))) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons).*)',
  ],
}
