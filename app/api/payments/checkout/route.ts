export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth/get-server-session"
import { providerPromise } from "@/lib/payments"
import { db } from "@/db/drizzle"
import { user } from "@/db/auth-schema"
import { subscriptions } from "@/db/payments-schema"
import { eq, and, inArray } from "drizzle-orm"
import { ajAuth } from "@/lib/arcjet"
import { slidingWindow } from "@arcjet/next"
import { env } from "@/env"
import { z } from "zod"
import { siteConfig } from "@/config/site"
import { resolveTierFromInternalPriceId } from "@/lib/payments/tier-utils"
import type { InternalPriceId } from "@/config/pricing"

const bodySchema = z.object({
  priceId: z.string().min(1),
  type: z.enum(["one_time", "subscription"]),
  trialDays: z.number().int().positive().optional(),
})

const ACTIVE_STATUSES = ["active", "trialing", "past_due"] as const

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
            siteConfig.security.arcjet.rateLimits.payments.checkout.interval,
          max: siteConfig.security.arcjet.rateLimits.payments.checkout.max,
        })
      )
      .protect(req, { userIdOrIp: session.user.id })
    if (decision.isDenied()) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 })
    }
  }

  const body = bodySchema.parse(await req.json())

  const [currentUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))

  if (!currentUser) {
    return NextResponse.json({ error: "User not found." }, { status: 404 })
  }

  const provider = await providerPromise

  // ── Plan change path ───────────────────────────────────────────────────────
  // If the user already has an active subscription and this is a subscription
  // purchase (not a one-time), update the existing subscription in place
  // rather than creating a new one. This prevents double-billing.
  if (body.type === "subscription") {
    const [existingActiveSub] = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, currentUser.id),
          inArray(subscriptions.status, [...ACTIVE_STATUSES])
        )
      )
      .limit(1)

    if (existingActiveSub && provider.capabilities.inPlacePlanChange) {
      // Resolve the tier for the requested plan to confirm it differs
      const requestedTier = resolveTierFromInternalPriceId(
        body.priceId as InternalPriceId
      )
      const currentTier = resolveTierFromInternalPriceId(
        existingActiveSub.planId as InternalPriceId
      )

      if (requestedTier.key === currentTier.key) {
        return NextResponse.json(
          { error: "You are already on this plan." },
          { status: 400 }
        )
      }

      // Update the existing subscription to the new plan
      const updated = await provider.changeSubscriptionPlan(
        existingActiveSub.providerSubscriptionId,
        body.priceId
      )

      // Sync DB immediately — webhook will also arrive and overwrite, which
      // is fine since both writes produce the same values
      await db
        .update(subscriptions)
        .set({
          planId: updated.planId,
          status: updated.status,
          cancelAtPeriodEnd: updated.cancelAtPeriodEnd,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, existingActiveSub.id))

      await db
        .update(user)
        .set({ tier: requestedTier.key })
        .where(eq(user.id, currentUser.id))

      // Return a redirect to the success page so the client-side
      // CheckoutButton handles this identically to a new checkout
      const appUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
      return NextResponse.json({
        mode: "redirect",
        url: `${appUrl}/pricing?success=true`,
      })
    }
  }

  // ── New purchase path ──────────────────────────────────────────────────────
  let customerId = currentUser.providerCustomerId ?? undefined

  if (!customerId) {
    const customer = await provider.createCustomer({
      email: currentUser.email,
      name: currentUser.name,
      metadata: { userId: currentUser.id },
    })
    customerId = customer.id
    await db
      .update(user)
      .set({
        ...(customer.id ? { providerCustomerId: customer.id } : {}),
        paymentProvider: provider.name,
      })
      .where(eq(user.id, currentUser.id))
  }

  const appUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  const result = await provider.initiateCheckout({
    ...body,
    customerId,
    successUrl: `${appUrl}/pricing?success=true`,
    cancelUrl: `${appUrl}/pricing`,
    metadata: {
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name ?? "",
    },
  })

  return NextResponse.json(result)
}
