import { siteConfig } from "@/config/site"
import { Metadata } from "next"
import { GatedPageTitle } from "@/components/layout/gated-page-title"
import { UserStats } from "@/app/admin/overview/components/user-stats"
import { SessionStats } from "@/app/admin/overview/components/session-stats"
import { RoleStats } from "@/app/admin/overview/components/role-stats"
import { db } from "@/db/drizzle"
import { user } from "@/db/auth-schema"
import { count, gte } from "drizzle-orm"
import { redis } from "@/lib/redis"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.admin.overview.title,
  description: siteConfig.seo.metaData.admin.overview.description,
  robots: siteConfig.seo.metaData.admin.overview.robots,
}

async function getActiveSessionCount(): Promise<number> {
  if (!redis) return 0
  let cursor = "0"
  let sessionCount = 0
  do {
    const result = await redis.scan(cursor, { match: "*", count: 100 })
    cursor = result[0] as string
    const keys = result[1] as string[]
    sessionCount += keys.filter((k) => !k.startsWith("active-sessions-")).length
  } while (cursor !== "0")
  return sessionCount
}

async function getOverviewData() {
  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 7)
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(now.getDate() - 30)

  const [totalResult, weekResult, monthResult, roleCounts, activeSessions] =
    await Promise.all([
      db.select({ count: count() }).from(user),
      db
        .select({ count: count() })
        .from(user)
        .where(gte(user.createdAt, sevenDaysAgo)),
      db
        .select({ count: count() })
        .from(user)
        .where(gte(user.createdAt, thirtyDaysAgo)),
      db
        .select({ role: user.role, count: count() })
        .from(user)
        .groupBy(user.role),
      getActiveSessionCount(),
    ] as const)

  return {
    total: totalResult[0].count,
    thisWeek: weekResult[0].count,
    thisMonth: monthResult[0].count,
    roleCounts,
    activeSessions,
  }
}

export default async function AdminOverviewPage() {
  const data = await getOverviewData()

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Overview"
        description="High-level statistics and user distribution for your application"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UserStats
          total={data.total}
          thisWeek={data.thisWeek}
          thisMonth={data.thisMonth}
        />
        <SessionStats activeSessions={data.activeSessions} />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Role Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RoleStats roleCounts={data.roleCounts} />
        </div>
      </div>
    </div>
  )
}
