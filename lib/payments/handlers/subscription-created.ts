import { db } from "@/db/drizzle"
import { subscriptions } from "@/db/payments-schema"
import { user } from "@/db/auth-schema"
import { providerPromise } from "@/lib/payments"
import { eq, or, and, inArray, ne } from "drizzle-orm"
import { resolveTierFromInternalPriceId } from "@/lib/payments/tier-utils"
import type { InternalPriceId } from "@/config/pricing"
import type { NormalizedEvent } from "@/db/types/payments/webhook-events"
import { sendEmail } from "@/lib/send-email"
import { renderSubscriptionCreatedEmail } from "@/emails/subscription-created"
import { siteConfig } from "@/config/site"

type SubscriptionCreatedEvent = Extract<
  NormalizedEvent,
  { type: "subscription.created" }
>

const ACTIVE_STATUSES = ["active", "trialing", "past_due"] as const

export async function handle(event: SubscriptionCreatedEvent): Promise<void> {
  const { subscription, customerId } = event

  const userId = subscription.metadata?.user_id
  const customerEmail = subscription.customerEmail

  const [existingUser] = await db
    .select()
    .from(user)
    .where(
      or(
        userId ? eq(user.id, userId) : undefined,
        customerId ? eq(user.providerCustomerId, customerId) : undefined,
        customerEmail ? eq(user.email, customerEmail) : undefined
      )
    )

  if (!existingUser) {
    throw new Error(`No user found for provider customer ID: "${customerId}"`)
  }

  const realCustomerId = customerId ? String(customerId) : null
  const tierConfig = resolveTierFromInternalPriceId(
    subscription.planId as InternalPriceId
  )
  const provider = await providerPromise

  // ── Cancel any other active subscriptions for this user ───────────────────
  // Guards against double-billing if the checkout route's plan-change path
  // was bypassed for any reason (race condition, two tabs, etc.)
  const otherActiveSubs = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, existingUser.id),
        inArray(subscriptions.status, [...ACTIVE_STATUSES]),
        ne(subscriptions.providerSubscriptionId, subscription.providerId)
      )
    )

  for (const oldSub of otherActiveSubs) {
    try {
      await provider.cancelSubscription(oldSub.providerSubscriptionId, {
        immediately: true,
      })
      await db
        .update(subscriptions)
        .set({
          status: "canceled",
          canceledAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, oldSub.id))
    } catch (err) {
      // Log but don't throw — failing to cancel an old sub must not block
      // the new subscription from being recorded
      console.error(
        `Failed to cancel old subscription ${oldSub.providerSubscriptionId} during plan upgrade:`,
        err
      )
    }
  }

  // ── Insert new subscription ────────────────────────────────────────────────
  await db
    .insert(subscriptions)
    .values({
      userId: existingUser.id,
      provider: provider.name,
      providerSubscriptionId: subscription.providerId,
      planId: subscription.planId,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      trialEnd: subscription.trialEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      rawData: subscription as unknown as Record<string, unknown>,
    })
    .onConflictDoNothing()

  await db
    .update(user)
    .set({
      tier: tierConfig.key,
      ...(realCustomerId && existingUser.providerCustomerId !== realCustomerId
        ? { providerCustomerId: realCustomerId }
        : {}),
    })
    .where(eq(user.id, existingUser.id))

  await sendEmail({
    to: existingUser.email,
    from: `${siteConfig.emails.subscriptions.sender} <${siteConfig.emails.subscriptions.fromEmail}>`,
    subject: `Your ${tierConfig.name} subscription is active`,
    body: await renderSubscriptionCreatedEmail({
      name: existingUser.name,
      planName: tierConfig.name,
    }),
  })
}
