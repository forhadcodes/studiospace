import { betterAuth } from "better-auth"
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
const client = new MongoClient(process.env.MONGODB_URI as string);

const db = client.db("studiospace");

/** True only for well-formed http(s) URLs with no path other than canonical ones. */
function isHttpUrl(value: string | undefined): value is string {
  if (!value?.trim()) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// BETTER_AUTH_URL is optional for a same-origin deployment: BetterAuth can
// derive the origin from each request. But a *malformed* value makes
// betterAuth() throw at module init (it validates the env var eagerly), which
// crashed the Vercel build while prerendering `/_not-found`. So: use the env
// var when it is a valid URL, otherwise blank it out and fall back to the
// request origin.
const RAW_BASE_URL = process.env.BETTER_AUTH_URL?.trim();
if (RAW_BASE_URL && !isHttpUrl(RAW_BASE_URL)) {
  console.warn(
    `[auth] Ignoring invalid BETTER_AUTH_URL "${RAW_BASE_URL}" (must start with http:// or https://). Falling back to per-request origins.`
  );
  // `process.env` is mutable in Node and BetterAuth reads it lazily at init.
  process.env.BETTER_AUTH_URL = "";
}

const BASE_URL = isHttpUrl(process.env.BETTER_AUTH_URL)
  ? process.env.BETTER_AUTH_URL
  : undefined;

// Google OAuth is optional at build/depoy time: only register the provider
// when both credentials exist, so a missing .env entry doesn't break startup —
// the login page just reports that social sign-in is unavailable.
const socialProviders: import("better-auth").BetterAuthOptions["socialProviders"] = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  baseURL: BASE_URL,
  emailAndPassword: {
    enabled: true,
    // Required for "Forgot Password" to be functional. This app has no SMTP
    // provider, so the reset link is written to the server logs instead of
    // being emailed — the login page shows the generic "check your email"
    // toast. Swap this for an email service (Resend/Nodemailer) when one is
    // wired up.
    sendResetPassword: async ({ user, url }) => {
      console.log(`[auth] Password reset link for ${user.email}: ${url}`);
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
  },
  socialProviders,
  // Account linking: lets a user who registered with email/password log in
  // with Google afterwards (same email), without a separate account.
  // - `trustedProviders: ["google"]` — Google verifies its emails itself, so
  //   it may implicitly link the OAuth account to the local user.
  // - `requireLocalEmailVerified: false` — our app has no email verification
  //   flow, so locally-registered users are `emailVerified: false`; with the
  //   default `true` BetterAuth would refuse the link ("account not linked").
  //   Keeping the trust list limited to google keeps this safe.
  // - `allowDifferentEmails` stays false: a Google account with a different
  //   email never silently links to the local user.
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      requireLocalEmailVerified: false,
    },
  },
  plugins: [
    // The minted JWT is stored in a 7-day cookie (`lib/auth-jwt.ts`), so the
    // token must live as long as the cookie — the plugin's default is only
    // 15 minutes, which caused 401s a few minutes after log-in.
    jwt({
      jwt: {
        expirationTime: "7d",
        definePayload: ({ user }) => ({
          email: user.email,
          name: user.name,
          image: user.image ?? null,
        }),
      },
    }),
  ],
  session:{
    cookieCache:{
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    }
  }
});
