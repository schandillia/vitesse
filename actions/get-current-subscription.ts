"use server"

import { and, desc, eq, ne, or } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { subscriptions } from "@/db/payments-schema"
import { user } from "@/db/auth-schema"
import { guardAction } from "@/lib/guard-action"

export type CurrentSubscriptionResult =
  | {
      success: true
      subscription: {
        tier: string | null
        provider: string | null
        planId: string | null
        status: string | null
        providerSubscriptionId: string | null
        currentPeriodEnd: Date | null
        cancelAtPeriodEnd: boolean
      } | null
    }
  | {
      success: false
      error: string
      code?: "RATE_LIMITED" | "UNAUTHORIZED"
    }

export async function getCurrentSubscription(): Promise<CurrentSubscriptionResult> {
  try {
    const {
      error,
      code,
      user: sessionUser,
    } = await guardAction({
      type: "read",
    })

    if (error) {
      return { success: false, error, code }
    }

    const [result] = await db
      .select({
        tier: user.tier,
        provider: subscriptions.provider,
        planId: subscriptions.planId,
        status: subscriptions.status,
        providerSubscriptionId: subscriptions.providerSubscriptionId,
        currentPeriodEnd: subscriptions.currentPeriodEnd,
        cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
      })
      .from(user)
      .leftJoin(
        subscriptions,
        and(
          eq(subscriptions.userId, user.id),

          or(
            ne(subscriptions.status, "canceled"),

            eq(subscriptions.cancelAtPeriodEnd, true)
          )
        )
      )
      .where(eq(user.id, sessionUser.id))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1)

    return {
      success: true,

      subscription: result
        ? {
            tier: result.tier,
            provider: result.provider,
            planId: result.planId,
            status: result.status,
            providerSubscriptionId: result.providerSubscriptionId,
            currentPeriodEnd: result.currentPeriodEnd,
            cancelAtPeriodEnd: result.cancelAtPeriodEnd ?? false,
          }
        : null,
    }
  } catch {
    return {
      success: false,
      error: "Failed to fetch subscription.",
    }
  }
}
