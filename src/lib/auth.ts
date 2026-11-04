import { betterAuth } from "better-auth"
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

/** Session/JWT lifetime — keep in sync with `JWT_MAX_AGE_SECONDS` in auth-jwt.ts. */
const SESSION_SECONDS = 7 * 24 * 60 * 60

/**
 * Duration string for the JWT plugin (a *number* is used as the absolute `exp`
 * claim, i.e. seconds since the epoch, so "7d" is the only safe form here).
 */
const JWT_EXPIRATION = "7d"

const client = new MongoClient(process.env.MONGODB_URI as string);

const db = client.db("studiospace");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: { 
    enabled: true, 
  },
  plugins: [
    jwt({
      jwt: {
        // The default is 15m, which would expire long before the 7-day
        // session cookie. The API routes verify this token, so it has to live
        // as long as the session it represents.
        expirationTime: JWT_EXPIRATION,
        // Keep the token small and only carry what the API routes need.
        // `sub` (user id) is added by the plugin automatically.
        definePayload: ({ user }) => ({
          email: user.email,
          name: user.name,
          image: user.image ?? null,
        }),
      },
    })
  ],
  session:{
    cookieCache:{
      enabled: true,
      strategy: "jwt",
      maxAge: SESSION_SECONDS, // 7 days
    }
  }
});
