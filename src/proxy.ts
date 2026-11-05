import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
const session = await auth.api.getSession({
    headers: await headers()
})
const user = session?.user
if (!user) {
  // Carry the originally requested page along so the login page can send the
  // user straight back to it after sign-in (?redirect=...) instead of home.
  const target = `${request.nextUrl.pathname}${request.nextUrl.search}`
  return NextResponse.redirect(
    new URL(`/login?redirect=${encodeURIComponent(target)}`, request.url)
  )
}

//   return NextResponse.redirect(new URL('/home', request.url))
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: [
    '/studio-explore/:path*',
    '/add-studio/:path*',
    '/my-booking/:path*',
  ],
}