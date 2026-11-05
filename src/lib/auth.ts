import { betterAuth } from "better-auth"
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
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