import { db } from "@/db/drizzle"
import { redis } from "@/lib/redis"
import { sql } from "drizzle-orm"
import { requireAdmin } from "@/lib/blog-utils"
import { NextResponse } from "next/server"

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

export async function GET() {
  const { authorized } = await requireAdmin()
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [db, cache] = await Promise.all([checkDatabase(), checkRedis()])

  return NextResponse.json({ db, cache, checkedAt: new Date().toISOString() })
}
