import { siteConfig } from "@/config/site"
import { Metadata } from "next"
import { GatedPageTitle } from "@/components/layout/gated-page-title"
import { UsersTable } from "@/app/(protected)/admin/users/components/users-table"
import { UsersToolbar } from "@/app/(protected)/admin/users/components/users-toolbar"
import { Pagination } from "@/app/(protected)/admin/users/components/pagination"
import { db } from "@/db/drizzle"
import { user } from "@/db/auth-schema"
import { count, ilike, or, eq, and } from "drizzle-orm"
import { ROLES, type Role } from "@/lib/auth/roles"
import { getServerSession } from "@/lib/auth/get-server-session"
import { redirect, unauthorized } from "next/navigation"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.admin.users.title,
  description: siteConfig.seo.metaData.admin.users.description,
  robots: siteConfig.seo.metaData.admin.users.robots,
}

const PAGE_SIZE = siteConfig.admin.usersPageSize

interface AdminUsersPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    role?: string
  }>
}

async function getUsers({
  page,
  search,
  role,
}: {
  page: number
  search: string
  role: Role | null
}) {
  const offset = (page - 1) * PAGE_SIZE
  const filters = []

  if (search) {
    filters.push(
      or(
        ilike(user.email, `%${search}%`),
        ilike(user.name, `%${search}%`),
        ilike(user.username, `%${search}%`)
      )
    )
  }

  if (role) {
    filters.push(eq(user.role, role))
  }

  const where = filters.length > 0 ? and(...filters) : undefined

  const [users, totalResult] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(where)
      .limit(PAGE_SIZE)
      .offset(offset)
      .orderBy(user.createdAt),
    db.select({ count: count() }).from(user).where(where),
  ])

  return {
    users,
    totalPages: Math.ceil(totalResult[0].count / PAGE_SIZE),
  }
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }
  if (user.role !== ROLES.ADMIN) {
    unauthorized()
  }

  const { page, search, role } = await searchParams

  const currentPage = Math.max(1, parseInt(page ?? "1"))
  const currentSearch = search ?? ""
  const currentRole =
    role && Object.values(ROLES).includes(role as Role) ? (role as Role) : null

  const { users, totalPages } = await getUsers({
    page: currentPage,
    search: currentSearch,
    role: currentRole,
  })

  return (
    <div className="container space-y-6">
      <GatedPageTitle
        title="Manage Users"
        description="View and manage platform users, assign roles, and control account access"
      />
      <UsersToolbar />
      <UsersTable users={users} currentUserId={session?.user.id ?? ""} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
