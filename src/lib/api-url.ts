/**
 * Base URL of the Express backend (no trailing slash).
 *
 * Set `NEXT_PUBLIC_API_URL` in `.env.local` (e.g. `http://localhost:5000`) or
 * in the hosting provider's environment variables. Next.js inlines
 * `NEXT_PUBLIC_*` values at build time, so this constant is safe to import
 * from both server and client components.
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
  /\/+$/,
  "",
);

/** Builds an absolute backend URL from a path such as `/add-studio`. */
export function apiUrl(path: string): string {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
