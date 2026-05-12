import type { NormalizedEvent } from "@/db/types/payments/webhook-events"

type PaymentFailedEvent = Extract<NormalizedEvent, { type: "payment.failed" }>

export async function handle(event: PaymentFailedEvent): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { customerId } = event
  // Dunning email to customer
}
