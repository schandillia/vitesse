import type { NormalizedEvent } from "@/db/types/payments/webhook-events"

type PaymentFailedEvent = Extract<NormalizedEvent, { type: "payment.failed" }>

export async function handle(_event: PaymentFailedEvent): Promise<void> {
  // Subscription status transitions to past_due via subscription.updated.
  // This handler is a hook for future use: dunning emails via Resend.
}
