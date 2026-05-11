export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth/get-server-session"
import { providerPromise } from "@/lib/payments"
import { db } from "@/db/drizzle"
import { user } from "@/db/auth-schema"
import { subscriptions } from "@/db/payments-schema"
import { eq, desc } from "drizzle-orm"
import { ajAuth } from "@/lib/arcjet"
import { slidingWindow } from "@arcjet/next"
import { env } from "@/env"
import { ProviderCapabilityError } from "@/db/types/payments/payment-errors"

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (env.ARCJET_KEY) {
    const decision = await ajAuth
      .withRule(slidingWindow({ mode: "LIVE", interval: 60, max: 5 }))
      .protect(req, { userIdOrIp: session.user.id })
    if (decision.isDenied()) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 })
    }
  }

  const [currentUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))

  if (!currentUser?.providerCustomerId) {
    return NextResponse.json(
      { error: "No billing account found." },
      { status: 404 }
    )
  }

  // For LemonSqueezy, the billing portal URL comes from the subscription
  // object, not the customer object. Look up the most recent active
  // subscription and pass its provider ID to the adapter.
  const [activeSubscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1)

  const portalId =
    activeSubscription?.providerSubscriptionId ?? currentUser.providerCustomerId

  const appUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  try {
    const provider = await providerPromise
    const result = await provider.createBillingPortalSession(
      portalId,
      `${appUrl}/dashboard/billing`
    )
    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof ProviderCapabilityError) {
      return NextResponse.json({ error: err.message }, { status: 501 })
    }
    throw err
  }
}
