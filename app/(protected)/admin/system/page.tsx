import { siteConfig } from "@/config/site"
import { Metadata } from "next"
import { GatedPageTitle } from "@/components/layout/gated-page-title"
import { EnvInfo } from "@/app/(protected)/admin/system/components/env-info"
import { InfrastructureHealth } from "@/app/(protected)/admin/system/components/infrastructure-health"
import { db } from "@/db/drizzle"
import { redis } from "@/lib/redis"
import { sql } from "drizzle-orm"
import packageJson from "@/package.json"
import { getServerSession } from "@/lib/auth/get-server-session"
import { redirect, unauthorized } from "next/navigation"
import { ROLES } from "@/lib/auth/roles"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.admin.system.title,
  description: siteConfig.seo.metaData.admin.system.description,
  robots: siteConfig.seo.metaData.admin.system.robots,
}

export const revalidate = 0

async function checkDatabase() {
  try {
    const start = Date.now()
    await db.execute(sql`SELECT 1`)
    return { healthy: true, latencyMs: Date.now() - start }
  } catch (e) {
    return {
      healthy: false,
      latencyMs: null,
      error: e instanceof Error ? e.message : "Unknown error",
    }
  }
}

async function checkRedis() {
  if (!redis) {
    return { healthy: false, latencyMs: null, error: "Not configured" }
  }
  try {
    const start = Date.now()
    await redis.ping()
    return { healthy: true, latencyMs: Date.now() - start }
  } catch (e) {
    return {
      healthy: false,
      latencyMs: null,
      error: e instanceof Error ? e.message : "Unknown error",
    }
  }
}

export default async function AdminSystemPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }
  if (user.role !== ROLES.ADMIN) {
    unauthorized()
  }

  const [dbHealth, cacheHealth] = await Promise.all([
    checkDatabase(),
    checkRedis(),
  ])

  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA

  const envItems = [
    { label: "Environment", value: process.env.NODE_ENV ?? "unknown" },
    { label: "Node.js Version", value: process.version },
    { label: "Platform", value: process.platform },
    { label: "App Version", value: packageJson.version },
    { label: "App URL", value: siteConfig.brand.url },
    { label: "Auth URL", value: process.env.BETTER_AUTH_URL ?? "not set" },
    {
      label: "Deployment Environment",
      value: process.env.VERCEL_ENV ?? "local",
    },
    { label: "Region", value: process.env.VERCEL_REGION ?? "unknown" },
    {
      label: "Git Branch",
      value: process.env.VERCEL_GIT_COMMIT_REF ?? "unknown",
    },
    {
      label: "Commit SHA",
      value: commitSha ? commitSha.slice(0, 7) : "unknown",
    },
    {
      label: "Commit Message",
      value: process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "unknown",
    },
    {
      label: "Deployment ID",
      value: process.env.VERCEL_DEPLOYMENT_ID ?? "unknown",
    },
  ]

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="System Info"
        description="View environment configurations and real-time infrastructure health checks."
      />

      {/* Environment */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Environment</h2>
        <EnvInfo items={envItems} />
      </section>

      {/* Infrastructure */}
      <section>
        <InfrastructureHealth initialDb={dbHealth} initialCache={cacheHealth} />
      </section>
    </div>
  )
}
