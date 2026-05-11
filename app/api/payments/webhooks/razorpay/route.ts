export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { providerPromise } from "@/lib/payments"
import { dispatchNormalizedEvent } from "@/lib/payments/handlers"
import { db } from "@/db/drizzle"
import { sql } from "drizzle-orm"
import * as Sentry from "@sentry/nextjs"

export async function POST(req: NextRequest) {
  const rawBody = Buffer.from(await req.arrayBuffer())
  const signature = req.headers.get("x-razorpay-signature") ?? ""

  const provider = await providerPromise

  let rawEvent: Record<string, unknown>
  try {
    rawEvent = await provider.constructWebhookEvent(rawBody, signature)
  } catch {
    return new NextResponse("Bad signature", { status: 400 })
  }

  // Razorpay event ID lives at payload.payment.entity.id or a top-level id
  // Use the event name + a timestamp-based fallback for idempotency key
  const eventType = (rawEvent.event as string | undefined) ?? "unknown"

  // Extract a deterministic event ID from the payload entity
  // Razorpay has no top-level event ID — use the entity ID + event name
  const payload = rawEvent.payload as Record<string, unknown> | undefined
  const paymentEntity = (
    payload?.payment as Record<string, unknown> | undefined
  )?.entity as Record<string, unknown> | undefined
  const subscriptionEntity = (
    payload?.subscription as Record<string, unknown> | undefined
  )?.entity as Record<string, unknown> | undefined
  const refundEntity = (payload?.refund as Record<string, unknown> | undefined)
    ?.entity as Record<string, unknown> | undefined

  const entityId =
    (paymentEntity?.id as string | undefined) ??
    (subscriptionEntity?.id as string | undefined) ??
    (refundEntity?.id as string | undefined) ??
    crypto.randomUUID()

  const providerEventId = `${eventType}_${entityId}`

  const insertResult = await db.execute(sql`
    INSERT INTO webhook_events (id, provider, provider_event_id, event_type, status, raw_payload, received_at)
    VALUES (
      gen_random_uuid(),
      'razorpay',
      ${providerEventId},
      ${eventType},
      'received',
      ${JSON.stringify(rawEvent)}::jsonb,
      now()
    )
    ON CONFLICT (provider, provider_event_id) DO NOTHING
    RETURNING id
  `)

  if (insertResult.rowCount === 0) {
    return new NextResponse("Already processed", { status: 200 })
  }

  const webhookRowId = insertResult.rows[0].id as string

  const normalizedEvent = provider.normalizeWebhookEvent(rawEvent)

  if (!normalizedEvent || normalizedEvent.type === "unknown") {
    await db.execute(sql`
      UPDATE webhook_events
      SET status = 'ignored', processed_at = now()
      WHERE id = ${webhookRowId}
    `)
    return new NextResponse("OK", { status: 200 })
  }

  try {
    await dispatchNormalizedEvent(normalizedEvent)
    await db.execute(sql`
      UPDATE webhook_events
      SET status = 'processed', processed_at = now()
      WHERE id = ${webhookRowId}
    `)
  } catch (err) {
    Sentry.captureException(err)
    await db.execute(sql`
      UPDATE webhook_events
      SET status = 'failed', error = ${(err as Error).message}
      WHERE id = ${webhookRowId}
    `)
  }

  return new NextResponse("OK", { status: 200 })
}
