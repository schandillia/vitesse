"use client"

import { useSession, authClient } from "@/lib/auth/auth-client"
import { usePathname, useRouter } from "next/navigation"
import { publicRoutes } from "@/routes"

export function useUserMenu() {
  const { data: session, isPending } = useSession()
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

  return {
    user: session?.user ?? null,
    isPending,
    handleSignOut,
  }
}
