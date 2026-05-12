import type { NormalizedEvent } from "@/db/types/payments/webhook-events"

export async function dispatchNormalizedEvent(
  event: NormalizedEvent
): Promise<void> {
  switch (event.type) {
    case "checkout.completed":
      return (
        await import("@/lib/payments/handlers/checkout-completed")
      ).handle(event)
    case "subscription.created":
      return (
        await import("@/lib/payments/handlers/subscription-created")
      ).handle(event)
    case "subscription.updated":
      return (
        await import("@/lib/payments/handlers/subscription-updated")
      ).handle(event)
    case "subscription.deleted":
      return (
        await import("@/lib/payments/handlers/subscription-deleted")
      ).handle(event)
    case "payment.succeeded":
      return (await import("@/lib/payments/handlers/payment-succeeded")).handle(
        event
      )
    case "payment.failed":
      return (await import("@/lib/payments/handlers/payment-failed")).handle(
        event
      )
    case "refund.created":
      return (await import("@/lib/payments/handlers/refund-created")).handle(
        event
      )
    case "unknown":
      return
  }
}
