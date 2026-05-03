import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { ROLES } from "@/db/types/roles"

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

export async function canEditPost(authorId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) return false

  const isAdmin = session.user.role === ROLES.ADMIN
  const isOwner = session.user.id === authorId

  return isAdmin && isOwner
}

export function isDuplicateKeyError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false

  // 1. Direct code check (standard Postgres driver)
  if ("code" in error && error.code === "23505") return true

  // 2. Wrapped cause check (Drizzle / Next.js wrapping)
  if (
    "cause" in error &&
    typeof error.cause === "object" &&
    error.cause !== null
  ) {
    if (
      "code" in error.cause &&
      (error.cause as { code: string }).code === "23505"
    ) {
      return true
    }
  }

  // 3. Deep string inspection (Nuclear option for Neon HTTP driver)
  // This stringifies the entire error object, including hidden properties like 'cause' or detailed SQL states.
  const stringified = JSON.stringify(
    error,
    Object.getOwnPropertyNames(error)
  ).toLowerCase()
  return (
    stringified.includes("23505") ||
    stringified.includes("unique constraint") ||
    stringified.includes("duplicate key")
  )
}

export function getDuplicateKeyField(
  error: unknown
): "slug" | "name" | "unknown" {
  const stringified = JSON.stringify(
    error,
    Object.getOwnPropertyNames(error)
  ).toLowerCase()

  // 1. Check for explicit constraint names first
  if (stringified.includes("category_slug_unique")) return "slug"
  if (stringified.includes("category_name_unique")) return "name"

  // 2. Fallback to Postgres detail formatting which wraps the column in parentheses
  // This prevents accidental matches with the raw SQL query column names
  if (stringified.includes("(slug)")) return "slug"
  if (stringified.includes("(name)")) return "name"

  return "unknown"
}
