import type { NormalizedEvent } from "@/db/types/payments/webhook-events"

type PaymentSucceededEvent = Extract<
  NormalizedEvent,
  { type: "payment.succeeded" }
>

export async function handle(_event: PaymentSucceededEvent): Promise<void> {
  // Subscription status is kept current via subscription.updated events.
  // This handler is a hook for future use: receipts, analytics, audit logs.
}
