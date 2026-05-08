import { db } from "@/db/drizzle"
import { redis } from "@/lib/redis"
import { sql } from "drizzle-orm"
import { getServerSession } from "@/lib/auth/get-server-session"
import { ajAuth } from "@/lib/arcjet"
import { slidingWindow } from "@arcjet/next"
import { ROLES } from "@/db/types/roles"
import { NextRequest, NextResponse } from "next/server"
import { env } from "@/env"

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

export async function GET(req: NextRequest) {
  const session = await getServerSession()

  if (!session?.user || session.user.role !== ROLES.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (env.ARCJET_KEY) {
    const decision = await ajAuth
      .withRule(slidingWindow({ mode: "LIVE", interval: 60, max: 30 }))
      .protect(req, { userIdOrIp: session.user.id })

    if (decision.isDenied()) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 })
    }
  }

  const [dbHealth, cache] = await Promise.all([checkDatabase(), checkRedis()])

  return NextResponse.json({
    db: dbHealth,
    cache,
    checkedAt: new Date().toISOString(),
  })
}
