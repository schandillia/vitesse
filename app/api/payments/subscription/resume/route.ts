export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth/get-server-session"
import { providerPromise } from "@/lib/payments"
import { db } from "@/db/drizzle"
import { subscriptions } from "@/db/payments-schema"
import { eq, and } from "drizzle-orm"
import { ajAuth } from "@/lib/arcjet"
import { slidingWindow } from "@arcjet/next"
import { env } from "@/env"
import { z } from "zod"
import { siteConfig } from "@/config/site"

const bodySchema = z.object({
  subscriptionId: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (env.ARCJET_KEY) {
    const decision = await ajAuth
      .withRule(
        slidingWindow({
          mode: "LIVE",
          interval:
            siteConfig.security.arcjet.rateLimits.payments.subscriptionMutate
              .interval,
          max: siteConfig.security.arcjet.rateLimits.payments.subscriptionMutate
            .max,
        })
      )
      .protect(req, { userIdOrIp: session.user.id })
    if (decision.isDenied()) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 })
    }
  }

  const body = bodySchema.parse(await req.json())
  const [existingSub] = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.providerSubscriptionId, body.subscriptionId),
        eq(subscriptions.userId, session.user.id)
      )
    )
    .limit(1)
  if (!existingSub) {
    return NextResponse.json(
      { error: "Subscription not found." },
      { status: 404 }
    )
  }
  const provider = await providerPromise
  const result = await provider.resumeSubscription(body.subscriptionId)
  await db
    .update(subscriptions)
    .set({
      cancelAtPeriodEnd: false,
      status: "active",
      canceledAt: null,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, existingSub.id))

  return NextResponse.json(result)
}
