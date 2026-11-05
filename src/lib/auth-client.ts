import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

/**
 * Resolve the base URL for the auth client without ever throwing.
 *
 * createAuthClient eagerly validates whichever value it resolves — including
 * BETTER_AUTH_URL / NEXT_PUBLIC_BETTER_AUTH_URL read from the environment when
 * no baseURL is passed. A malformed env value (e.g. an inline "# comment"
 * pasted into Vercel's dashboard, which is stored literally) crashed the
 * Vercel build while prerendering `/_not-found`. So: mirror
 * better-auth's own resolution order but fall back instead of throwing.
 */
function resolveAuthBaseURL(): string {
  // In the browser the client is same-origin with the auth API on both
  // localhost and the deployed Vercel domain, so always prefer the real origin.
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  // Server-side render / prerender: use the env var only if it is a well-formed
  // http(s) URL.
  const raw = (
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? process.env.BETTER_AUTH_URL
  )?.trim();
  if (raw) {
    try {
      const parsed = new URL(raw);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.origin;
      }
    } catch {
      // Malformed env value — fall through to the safe placeholder below.
    }
  }

  // Prerender fallback. No module-level auth calls happen on the server (the
  // client only fetches from effects in the browser), so this value is never
  // actually used for a request — it just needs to be a valid URL so
  // createAuthClient's validation passes.
  return "http://localhost:3000";
}

export const authClient = createAuthClient({
  baseURL: resolveAuthBaseURL(),
  plugins: [jwtClient()],
});
