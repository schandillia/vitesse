import { siteConfig } from "@/config/site"
import { Metadata } from "next"
import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { type ActivityRow } from "@/app/(protected)/admin/activity/components/activity-table"
import { db } from "@/db/drizzle"
import { auditLog, user } from "@/db/auth-schema"
import { desc, eq, count, gte, lte, and } from "drizzle-orm"
import { redirect, unauthorized } from "next/navigation"
import { getServerSession } from "@/lib/auth/get-server-session"
import { ROLES } from "@/db/types/roles"
import { ActivitySection } from "@/app/(protected)/admin/users/components/activity-section"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.admin.activity.title,
  description: siteConfig.seo.metaData.admin.activity.description,
  robots: siteConfig.seo.metaData.admin.activity.robots,
}

const PAGE_SIZE = siteConfig.admin.usersPageSize

interface AdminActivityPageProps {
  searchParams: Promise<{
    page?: string
    event?: string
    from?: string
    to?: string
  }>
}

async function getActivity({
  page,
  event,
  from,
  to,
}: {
  page: number
  event: string | null
  from: string | null
  to: string | null
}) {
  const offset = (page - 1) * PAGE_SIZE

  const filters = []

  if (event) filters.push(eq(auditLog.event, event))
  if (from) filters.push(gte(auditLog.createdAt, new Date(from)))
  if (to) {
    const toDate = new Date(to)
    toDate.setHours(23, 59, 59, 999)
    filters.push(lte(auditLog.createdAt, toDate))
  }

  const where = filters.length > 0 ? and(...filters) : undefined

  const [rows, totalResult] = await Promise.all([
    db
      .select({
        id: auditLog.id,
        event: auditLog.event,
        metadata: auditLog.metadata,
        createdAt: auditLog.createdAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(auditLog)
      .leftJoin(user, eq(auditLog.userId, user.id))
      .where(where)
      .orderBy(desc(auditLog.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset),
    db.select({ count: count() }).from(auditLog).where(where),
  ])

  return {
    rows: rows as ActivityRow[],
    totalPages: Math.ceil(totalResult[0].count / PAGE_SIZE),
  }
}

export default async function AdminActivityPage({
  searchParams,
}: AdminActivityPageProps) {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }
  if (user.role !== ROLES.ADMIN) {
    unauthorized()
  }

  const { page, event, from, to } = await searchParams

  const currentPage = Math.max(1, parseInt(page ?? "1"))
  const currentEvent = event ?? null
  const currentFrom = from ?? null
  const currentTo = to ?? null

  const { rows, totalPages } = await getActivity({
    page: currentPage,
    event: currentEvent,
    from: currentFrom,
    to: currentTo,
  })

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Activity"
        description="Monitor platform events and user activity"
      />
      <ActivitySection
        rows={rows}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  )
}
