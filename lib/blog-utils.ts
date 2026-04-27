import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { ROLES } from "@/lib/auth/roles"

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user || session.user.role !== ROLES.ADMIN) {
    return { authorized: false as const }
  }

  return { authorized: true as const, user: session.user }
}

export function resolveExcerpt(
  excerpt?: string,
  logline?: string,
  content?: string
): string | null {
  if (excerpt?.trim()) return excerpt.trim()
  if (logline?.trim()) return logline.trim()
  if (content?.trim()) {
    return (
      content
        .replace(/[#*_`~\[\]]/g, "")
        .trim()
        .slice(0, 160) || null
    )
  }
  return null
}
