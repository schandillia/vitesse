export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth/get-server-session"
import { providerPromise } from "@/lib/payments"
import { db } from "@/db/drizzle"
import { user } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { ajAuth } from "@/lib/arcjet"
import { slidingWindow } from "@arcjet/next"
import { env } from "@/env"
import { z } from "zod"
import { siteConfig } from "@/config/site"

const bodySchema = z.object({
  priceId: z.string().min(1),
  type: z.enum(["one_time", "subscription"]),
  trialDays: z.number().int().positive().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (env.ARCJET_KEY) {
    const decision = await ajAuth
      .withRule(slidingWindow({ mode: "LIVE", interval: 60, max: 10 }))
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
        providerCustomerId: customer.id,
        paymentProvider: provider.name,
      })
      .where(eq(user.id, currentUser.id))
  }

  const appUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  const result = await provider.initiateCheckout({
    ...body,
    customerId,
    successUrl: `${appUrl}/${siteConfig.authAndSession.callbackAfterLogin}`,
    cancelUrl: `${appUrl}/pricing`,
    metadata: {
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name ?? "",
    },
  })

  return NextResponse.json(result)
}
