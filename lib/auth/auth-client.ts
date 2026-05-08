import { createAuthClient } from "better-auth/react"
import {
  magicLinkClient,
  inferAdditionalFields,
} from "better-auth/client/plugins"
import { passkeyClient } from "@better-auth/passkey/client"
import { apiKeyClient } from "@better-auth/api-key/client"
import type { auth } from "@/lib/auth/auth"
import { env } from "@/env"

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    magicLinkClient(),
    passkeyClient(),
    apiKeyClient(),
    inferAdditionalFields<typeof auth>(),
  ],
})

export const { signIn, signUp, useSession } = authClient
