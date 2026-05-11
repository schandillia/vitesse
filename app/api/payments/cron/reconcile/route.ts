export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/drizzle"
import { webhookEvents } from "@/db/payments-schema"
import { providerPromise } from "@/lib/payments"
import { dispatchNormalizedEvent } from "@/lib/payments/handlers"
import { env } from "@/env"
import { eq, and, gt } from "drizzle-orm"
import * as Sentry from "@sentry/nextjs"

export async function POST(req: NextRequest) {
  // Verify cron secret — reject unauthorized calls
  const secret = req.headers.get("x-cron-secret")
  if (!secret || secret !== env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago

  // Find all failed events from the past 24 hours
  const failedEvents = await db
    .select()
    .from(webhookEvents)
    .where(
      and(
        eq(webhookEvents.status, "failed"),
        gt(webhookEvents.receivedAt, cutoff)
      )
    )

  if (failedEvents.length === 0) {
    return NextResponse.json({ message: "No failed events to reconcile." })
  }

  const provider = await providerPromise
  const results = { processed: 0, failed: 0, skipped: 0 }

  for (const event of failedEvents) {
    // Only reconcile events for the active provider
    if (event.provider !== provider.name) {
      results.skipped++
      continue
    }

    try {
      const normalizedEvent = provider.normalizeWebhookEvent(
        event.rawPayload as Record<string, unknown>
      )

      if (!normalizedEvent || normalizedEvent.type === "unknown") {
        await db
          .update(webhookEvents)
          .set({ status: "ignored", processedAt: new Date() })
          .where(eq(webhookEvents.id, event.id))
        results.skipped++
        continue
      }

      await dispatchNormalizedEvent(normalizedEvent)

      await db
        .update(webhookEvents)
        .set({ status: "processed", processedAt: new Date() })
        .where(eq(webhookEvents.id, event.id))

      results.processed++
    } catch (err) {
      Sentry.captureException(err)
      await db
        .update(webhookEvents)
        .set({ error: (err as Error).message })
        .where(eq(webhookEvents.id, event.id))
      results.failed++
    }
  }

  return NextResponse.json({
    message: "Reconciliation complete.",
    ...results,
  })
}
