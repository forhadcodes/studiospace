import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { auth } from "@/lib/auth"

/**
 * Name of the HTTPOnly cookie that carries the BetterAuth JWT.
 *
 * The session cookie set by BetterAuth stays as-is (it is HTTPOnly too); this
 * second cookie holds the signed JWT that server-side mutations verify, so the
 * token never has to be readable from client JS (`document.cookie`).
 */
export const JWT_COOKIE_NAME = "studiospace_jwt"

/** Matches the BetterAuth session lifetime (7 days, see `lib/auth.ts`). */
export const JWT_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

/**
 * Flags for the JWT cookie:
 * - `httpOnly` — not reachable from JS, so XSS cannot exfiltrate the token.
 * - `sameSite: "lax"` — the cookie still rides along on same-origin fetches
 *   (all our API calls) but not on cross-site requests.
 * - `secure` — HTTPS-only in production; left off in dev because
 *   `npm run dev` runs on plain http://localhost.
 */
export const jwtCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: JWT_MAX_AGE_SECONDS,
} as const

/** Claims we rely on inside the API routes. */
export type JwtUser = {
  id: string
  email: string
  name: string
  image: string | null
}

/**
 * Reads the JWT from the HTTPOnly cookie, falling back to
 * `Authorization: Bearer <jwt>` so server-to-server and curl/Postman calls
 * can authenticate without a browser cookie jar.
 */
export async function readJwtToken(request: Request): Promise<string | null> {
  const authorization = request.headers.get("authorization")
  if (authorization?.toLowerCase().startsWith("bearer ")) {
    const token = authorization.slice("bearer ".length).trim()
    if (token) return token
  }

  const cookieStore = await cookies()
  return cookieStore.get(JWT_COOKIE_NAME)?.value ?? null
}

/**
 * Verifies the request JWT and returns the user it belongs to.
 * Returns `null` for a missing, tampered, or expired token.
 */
export async function getJwtUser(request: Request): Promise<JwtUser | null> {
  const token = await readJwtToken(request)
  if (!token) return null

  try {
    const { payload } = await auth.api.verifyJWT({ body: { token } })
    if (!payload?.sub) return null

    // `definePayload` in lib/auth.ts puts the user's email/name in the token.
    const email = typeof payload.email === "string" ? payload.email : null
    if (!email) return null

    return {
      id: payload.sub,
      email,
      name:
        typeof payload.name === "string" && payload.name ? payload.name : email,
      image: typeof payload.image === "string" ? payload.image : null,
    }
  } catch {
    return null
  }
}

/** Standard 401 body for protected mutations. */
export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ message }, { status: 401 })
}
