import { siteConfig } from "@/config/site"
import { Metadata } from "next"
import { GatedPageTitle } from "@/components/layout/gated-page-title"
import {
  ActivityTable,
  type ActivityRow,
} from "@/app/admin/activity/components/activity-table"
import { ActivityToolbar } from "@/app/admin/activity/components/activity-toolbar"
import { Pagination } from "@/app/admin/users/components/pagination"
import { db } from "@/db/drizzle"
import { auditLog, user } from "@/db/auth-schema"
import { desc, eq, count } from "drizzle-orm"

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
  }>
}

async function getActivity({
  page,
  event,
}: {
  page: number
  event: string | null
}) {
  const offset = (page - 1) * PAGE_SIZE

  const where = event ? eq(auditLog.event, event) : undefined

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
  const { page, event } = await searchParams

  const currentPage = Math.max(1, parseInt(page ?? "1"))
  const currentEvent = event ?? null

  const { rows, totalPages } = await getActivity({
    page: currentPage,
    event: currentEvent,
  })

  return (
    <div className="container space-y-6">
      <GatedPageTitle
        title="Activity"
        description="Monitor platform events and user activity"
      />
      <ActivityToolbar />
      <ActivityTable rows={rows} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
