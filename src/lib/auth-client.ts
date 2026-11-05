import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    // No baseURL needed: the client is same-origin with the auth API on both
    // localhost and the deployed Vercel domain. Passing process.env values
    // here broke prerendering on Vercel when the env var was invalid.
    plugins: [
        jwtClient()]

    
})