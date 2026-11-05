/**
 * Maps the `?error=<code>` query parameter BetterAuth appends when the OAuth
 * callback fails (see `redirectOnError` in better-auth's oauth2/errors) to a
 * user-facing message. Unknown codes fall back to a generic message.
 */
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  no_code: "Google didn't return an authorization code. Please try again.",
  oauth_provider_not_found:
    "Google sign-in is not configured on the server. Please contact support.",
  invalid_code:
    "The Google sign-in attempt expired or was invalid. Please try again.",
  state_mismatch:
    "Your sign-in session timed out or was tampered with. Please try again.",
  unable_to_get_user_info:
    "Could not get your Google profile. Please try again.",
  no_callback_url: "Google sign-in was misconfigured. Please contact support.",
  unable_to_link_account:
    "We couldn't link your Google account to StudioSpace. Please contact support.",
  email_does_not_match:
    "This Google account's email does not match your registered email, so we couldn't link it. Log in with your email/password instead.",
  email_not_found:
    "Google did not share an email address with us, so sign-in was stopped.",
  email_not_verified:
    "Your email is not verified, so sign-in was stopped. Please contact support.",
}

export function describeOAuthError(code: string | null): string {
  if (!code) return "Google sign-in failed. Please try again."
  return (
    OAUTH_ERROR_MESSAGES[code] ?? "Google sign-in failed. Please try again."
  )
}
