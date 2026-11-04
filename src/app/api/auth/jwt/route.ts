import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { JWT_COOKIE_NAME, jwtCookieOptions } from "@/lib/auth-jwt"

/**
 * POST /api/auth/jwt — mints a BetterAuth JWT for the current session and
 * stores it in the HTTPOnly `studiospace_jwt` cookie.
 *
 * The client calls this right after sign-in/sign-up (and once per page load via
 * `<JwtCookieSync />`) so the write APIs can verify the token server-side. The
 * token is deliberately NOT returned in the body: keeping it out of JS is the
 * whole point of the HTTPOnly cookie.
 */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session?.user) {
    const response = NextResponse.json(
      { message: "Please log in to continue." },
      { status: 401 }
    )
    response.cookies.delete(JWT_COOKIE_NAME)
    return response
  }

  const { token } = await auth.api.getToken({ headers: request.headers })

  const response = NextResponse.json({ ok: true })
  response.cookies.set(JWT_COOKIE_NAME, token, jwtCookieOptions)
  return response
}

/** DELETE /api/auth/jwt — clears the cookie (called on logout). */
export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(JWT_COOKIE_NAME)
  return response
}
