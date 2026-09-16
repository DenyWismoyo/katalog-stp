import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME, SessionData } from '@/lib/auth/constants'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Abaikan static files dan API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value

  let session: SessionData | null = null
  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie) as SessionData
    } catch {
      session = null
    }
  }

  // 1. Proteksi Route Administrator (/admin/*)
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const loginUrl = new URL('/portal', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (session.role !== 'admin') {
      // Jika operator masuk ke /admin, alihkan ke dashboard operator miliknya
      return NextResponse.redirect(new URL('/operator/orders', request.url))
    }
  }

  // 2. Proteksi Route Operator Layanan (/operator/*)
  if (pathname.startsWith('/operator')) {
    if (!session) {
      const loginUrl = new URL('/portal', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (session.role !== 'operator' && session.role !== 'admin') {
      const loginUrl = new URL('/portal', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/operator/:path*',
  ],
}
