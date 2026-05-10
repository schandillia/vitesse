import {
  lemonSqueezySetup,
  createCheckout,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  getCustomer,
} from "@lemonsqueezy/lemonsqueezy.js"
import crypto from "crypto"
import { env } from "@/env"
import type {
  PaymentProvider,
  ProviderCapabilities,
} from "@/db/types/payments/provider"
import type {
  CreateCustomerParams,
  Customer,
} from "@/db/types/payments/customer"
import type {
  CheckoutParams,
  CheckoutResult,
  VerifyCheckoutResult,
} from "@/db/types/payments/checkout"
import type { NormalizedSubscription } from "@/db/types/payments/normalized-subscription"
import type {
  RawProviderEvent,
  NormalizedEvent,
} from "@/db/types/payments/webhook-events"
import { WebhookSignatureError } from "@/db/types/payments/payment-errors"
import {
  resolveProviderPriceId,
  resolveInternalPriceId,
} from "@/lib/payments/price-map"

if (!env.LEMONSQUEEZY_API_KEY) {
  throw new Error(
    "LEMONSQUEEZY_API_KEY is not set but PAYMENT_PROVIDER=lemonsqueezy."
  )
}

lemonSqueezySetup({ apiKey: env.LEMONSQUEEZY_API_KEY })

const STORE_ID = env.LEMONSQUEEZY_STORE_ID!

export class LemonSqueezyAdapter implements PaymentProvider {
  readonly name = "lemonsqueezy" as const

  readonly capabilities: ProviderCapabilities = {
    hostedCheckout: true,
    billingPortal: true,
    freeTrials: true,
    proration: false,
    automaticTax: true,
    subscriptionPause: true,
    idempotencyKeys: false,
    localPaymentMethods: [],
  }

  // ── Customer ───────────────────────────────────────────────────────────────
  // LemonSqueezy has no explicit createCustomer API — customers are created
  // implicitly on first order. We return a synthetic customer object using
  // the email as the ID, which gets stored as providerCustomerId on the user.
  // The real LS customer ID is synced from the first webhook event.

  async createCustomer(params: CreateCustomerParams): Promise<Customer> {
    return {
      id: params.email,
      email: params.email,
      name: params.name,
    }
  }

  async getCustomer(customerId: string): Promise<Customer> {
    const { data, error } = await getCustomer(customerId)
    if (error ?? !data) {
      throw new Error(`LemonSqueezy customer not found: "${customerId}"`)
    }
    return {
      id: String(data.data.id),
      email: data.data.attributes.email,
      name: data.data.attributes.name,
    }
  }

  // ── Checkout ───────────────────────────────────────────────────────────────

  async initiateCheckout(params: CheckoutParams): Promise<CheckoutResult> {
    const variantId = resolveProviderPriceId(
      params.priceId as Parameters<typeof resolveProviderPriceId>[0],
      "lemonsqueezy"
    )

    const { data, error } = await createCheckout(STORE_ID, variantId, {
      checkoutOptions: {
        embed: false,
      },
      checkoutData: {
        email: params.metadata?.userEmail,
        custom: {
          userId: params.metadata?.userId ?? "",
        },
      },
      productOptions: {
        redirectUrl: params.successUrl,
      },
      ...(params.type === "subscription" && params.trialDays
        ? { trialEndsAt: getTrialEndDate(params.trialDays) }
        : {}),
    })

    if (error ?? !data) {
      throw new Error(
        `LemonSqueezy checkout creation failed: ${error?.message}`
      )
    }

    return {
      mode: "redirect",
      url: data.data.attributes.url,
    }
  }

  // LemonSqueezy verification is handled via webhook — no-op here.
  async verifyCheckout(): Promise<VerifyCheckoutResult> {
    return { success: true, paymentId: "" }
  }

  // ── Subscription management ────────────────────────────────────────────────

  async getSubscription(
    subscriptionId: string
  ): Promise<NormalizedSubscription> {
    const { data, error } = await getSubscription(subscriptionId)
    if (error ?? !data) {
      throw new Error(
        `LemonSqueezy subscription not found: "${subscriptionId}"`
      )
    }
    return this.normalizeSubscription(data.data)
  }

  async cancelSubscription(
    subscriptionId: string
  ): Promise<NormalizedSubscription> {
    const { data, error } = await cancelSubscription(subscriptionId)
    if (error ?? !data) {
      throw new Error(
        `LemonSqueezy cancellation failed for "${subscriptionId}": ${error?.message}`
      )
    }
    return this.normalizeSubscription(data.data)
  }

  async resumeSubscription(
    subscriptionId: string
  ): Promise<NormalizedSubscription> {
    const { data, error } = await updateSubscription(subscriptionId, {
      pause: null,
    })
    if (error ?? !data) {
      throw new Error(
        `LemonSqueezy resume failed for "${subscriptionId}": ${error?.message}`
      )
    }
    return this.normalizeSubscription(data.data)
  }

  async changeSubscriptionPlan(
    subscriptionId: string,
    newPlanId: string
  ): Promise<NormalizedSubscription> {
    const newVariantId = resolveProviderPriceId(
      newPlanId as Parameters<typeof resolveProviderPriceId>[0],
      "lemonsqueezy"
    )
    const { data, error } = await updateSubscription(subscriptionId, {
      variantId: Number(newVariantId),
    })
    if (error ?? !data) {
      throw new Error(
        `LemonSqueezy plan change failed for "${subscriptionId}": ${error?.message}`
      )
    }
    return this.normalizeSubscription(data.data)
  }

  // ── Billing portal ─────────────────────────────────────────────────────────

  async createBillingPortalSession(
    customerId: string
  ): Promise<{ url: string }> {
    const { data, error } = await getSubscription(customerId)
    if (error ?? !data) {
      throw new Error(
        `LemonSqueezy billing portal lookup failed: ${error?.message}`
      )
    }
    const portalUrl = data.data.attributes.urls?.customer_portal
    if (!portalUrl) {
      throw new Error("LemonSqueezy billing portal URL not available.")
    }
    return { url: portalUrl }
  }

  // ── Webhooks ───────────────────────────────────────────────────────────────

  async constructWebhookEvent(
    rawBody: Buffer,
    signature: string
  ): Promise<RawProviderEvent> {
    if (!env.LEMONSQUEEZY_WEBHOOK_SECRET) {
      throw new Error(
        "LEMONSQUEEZY_WEBHOOK_SECRET is not set but a LemonSqueezy webhook was received."
      )
    }

    const hmac = crypto
      .createHmac("sha256", env.LEMONSQUEEZY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex")

    if (hmac !== signature) {
      throw new WebhookSignatureError("lemonsqueezy")
    }

    return JSON.parse(rawBody.toString("utf-8")) as RawProviderEvent
  }

  normalizeWebhookEvent(raw: RawProviderEvent): NormalizedEvent | null {
    const eventName = raw.meta
      ? ((raw.meta as Record<string, unknown>).event_name as string)
      : undefined

    if (!eventName) return { type: "unknown", rawType: "missing_event_name" }

    const data = raw.data as Record<string, unknown> | undefined
    const attrs = data?.attributes as Record<string, unknown> | undefined

    if (!attrs) return { type: "unknown", rawType: eventName }

    switch (eventName) {
      case "order_created": {
        const customerId = String(
          (attrs.customer_id as number | undefined) ?? ""
        )
        return {
          type: "checkout.completed",
          customerId,
          sessionId: String(data?.id ?? ""),
          orderId: String(data?.id ?? ""),
          amountTotal: (attrs.total as number | undefined) ?? 0,
          currency: (attrs.currency as string | undefined) ?? "usd",
          metadata: this.extractCustomData(attrs),
        }
      }

      case "subscription_created": {
        const customerId = String(
          (attrs.customer_id as number | undefined) ?? ""
        )
        const metaCustomData = (raw.meta as Record<string, unknown>)
          ?.custom_data as Record<string, string> | undefined
        const normalized = this.normalizeSubscriptionFromAttrs(
          String(data?.id ?? ""),
          attrs,
          metaCustomData
        )
        return {
          type: "subscription.created",
          customerId,
          subscription: normalized,
        }
      }

      case "subscription_updated": {
        const customerId = String(
          (attrs.customer_id as number | undefined) ?? ""
        )
        const metaCustomData = (raw.meta as Record<string, unknown>)
          ?.custom_data as Record<string, string> | undefined
        const normalized = this.normalizeSubscriptionFromAttrs(
          String(data?.id ?? ""),
          attrs,
          metaCustomData
        )
        return {
          type: "subscription.updated",
          customerId,
          subscription: normalized,
        }
      }

      case "subscription_cancelled":
      case "subscription_expired": {
        const customerId = String(
          (attrs.customer_id as number | undefined) ?? ""
        )
        return {
          type: "subscription.deleted",
          customerId,
          subscriptionId: String(data?.id ?? ""),
        }
      }

      case "subscription_payment_success":
      case "subscription_payment_recovered": {
        const customerId = String(
          (attrs.customer_id as number | undefined) ?? ""
        )
        return {
          type: "payment.succeeded",
          customerId,
          subscriptionId: String(attrs.subscription_id ?? ""),
          amountPaid: (attrs.total as number | undefined) ?? 0,
          currency: (attrs.currency as string | undefined) ?? "usd",
        }
      }

      case "subscription_payment_failed": {
        const customerId = String(
          (attrs.customer_id as number | undefined) ?? ""
        )
        return {
          type: "payment.failed",
          customerId,
          subscriptionId: String(attrs.subscription_id ?? ""),
        }
      }

      default:
        return { type: "unknown", rawType: eventName }
    }
  }

  // ── Refunds ────────────────────────────────────────────────────────────────

  async refundPayment(): Promise<{ refundId: string; status: string }> {
    // LemonSqueezy refunds are issued manually via the dashboard.
    // API refunds are not supported in the JS SDK at this time.
    throw new Error(
      "LemonSqueezy refunds must be issued via the dashboard manually."
    )
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private normalizeSubscription(
    sub: Record<string, unknown>
  ): NormalizedSubscription {
    const attrs = sub.attributes as Record<string, unknown>
    return this.normalizeSubscriptionFromAttrs(String(sub.id ?? ""), attrs)
  }

  private normalizeSubscriptionFromAttrs(
    id: string,
    attrs: Record<string, unknown>,
    metaCustomData?: Record<string, string>
  ): NormalizedSubscription {
    const variantId = String(attrs.variant_id ?? "")
    const internalPlanId =
      resolveInternalPriceId(variantId, "lemonsqueezy") ?? "pro_monthly"

    const status = this.normalizeStatus(attrs.status as string | undefined)

    return {
      id,
      providerId: id,
      customerId: String(attrs.customer_id ?? ""),
      planId: internalPlanId,
      status,
      currentPeriodStart: attrs.renewed_at
        ? new Date(attrs.renewed_at as string)
        : new Date(),
      currentPeriodEnd: attrs.ends_at
        ? new Date(attrs.ends_at as string)
        : new Date(),
      cancelAtPeriodEnd: attrs.cancelled === true,
      trialEnd: attrs.trial_ends_at
        ? new Date(attrs.trial_ends_at as string)
        : null,
      metadata: {
        ...this.extractCustomData(attrs),
        ...(metaCustomData ?? {}),
      },
    }
  }

  private normalizeStatus(
    status: string | undefined
  ): NormalizedSubscription["status"] {
    switch (status) {
      case "active":
        return "active"
      case "on_trial":
        return "trialing"
      case "past_due":
        return "past_due"
      case "unpaid":
        return "unpaid"
      case "cancelled":
        return "canceled"
      case "paused":
        return "paused"
      case "expired":
        return "canceled"
      default:
        return "incomplete"
    }
  }

  private extractCustomData(
    attrs: Record<string, unknown>
  ): Record<string, string> {
    const customData = attrs.first_subscription_item ?? attrs.custom_data
    if (!customData || typeof customData !== "object") return {}
    return Object.fromEntries(
      Object.entries(customData as Record<string, unknown>).map(([k, v]) => [
        k,
        String(v),
      ])
    )
  }
}

function getTrialEndDate(trialDays: number): string {
  const date = new Date()
  date.setDate(date.getDate() + trialDays)
  return date.toISOString()
}
