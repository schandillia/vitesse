import { db } from "@/db/drizzle"
import { orders } from "@/db/payments-schema"
import { user } from "@/db/auth-schema"
import { providerPromise } from "@/lib/payments"
import { eq } from "drizzle-orm"
import type { NormalizedEvent } from "@/db/types/payments/webhook-events"

type CheckoutCompletedEvent = Extract<
  NormalizedEvent,
  { type: "checkout.completed" }
>

export async function handle(event: CheckoutCompletedEvent): Promise<void> {
  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.providerCustomerId, event.customerId))

  if (!existingUser) {
    throw new Error(
      `No user found for provider customer ID: "${event.customerId}"`
    )
  }

  // Only create an order row for one-time payments.
  // Subscription checkouts are fully handled by subscription.created.
  if (event.orderId && !event.subscriptionId) {
    const provider = await providerPromise
    await db.insert(orders).values({
      userId: existingUser.id,
      provider: provider.name,
      providerOrderId: event.orderId,
      planId: event.metadata.planId ?? "unknown",
      amount: event.amountTotal,
      currency: event.currency,
      status: "paid",
      rawData: event as unknown as Record<string, unknown>,
    })
  }
}
