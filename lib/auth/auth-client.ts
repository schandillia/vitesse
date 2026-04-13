import { createAuthClient } from "better-auth/react"
import {
  magicLinkClient,
  inferAdditionalFields,
} from "better-auth/client/plugins"
import { passkeyClient } from "@better-auth/passkey/client"
import type { auth } from "@/lib/auth/auth"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    magicLinkClient(),
    passkeyClient(),
    inferAdditionalFields<typeof auth>(),
  ],
})

export const { signIn, signUp, useSession } = authClient
