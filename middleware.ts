import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  const { data: { session } } = await supabase.auth.getSession()

  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/movies',
    '/favorites',
    '/bookmarks',
  ]

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !session) {
    const redirectUrl = request.nextUrl.pathname + request.nextUrl.search
    const loginUrl = new URL('/sign-in', request.url)
    loginUrl.searchParams.set('redirect', redirectUrl)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|sign-in|sign-up|$).*)',
  ]
}