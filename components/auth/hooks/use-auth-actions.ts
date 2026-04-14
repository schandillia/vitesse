"use client"

import { authClient } from "@/lib/auth/auth-client"
import { usePathname, useRouter } from "next/navigation"
import { publicRoutes } from "@/routes"

export function useAuthActions() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()

    if (publicRoutes.has(pathname)) {
      router.refresh()
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return { handleSignOut }
}
