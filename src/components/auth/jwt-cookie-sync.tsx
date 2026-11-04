"use client"

import { useEffect } from "react"

import { authClient } from "@/lib/auth-client"

/**
 * Keeps the HTTPOnly `studiospace_jwt` cookie in sync with the BetterAuth
 * session.
 *
 * Sign-in/sign-up already mint the cookie, but a user can also arrive with a
 * pre-existing session (or a JWT cookie that expired while the session was
 * still valid). This mirrors the session into the cookie once per page load so
 * the protected write APIs keep working.
 */
export function JwtCookieSync() {
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id

  useEffect(() => {
    if (!userId) return
    // Best-effort: a failure here only means protected writes return 401.
    void fetch("/api/auth/jwt", { method: "POST" }).catch(() => {})
  }, [userId])

  return null
}
