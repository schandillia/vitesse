export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth/get-server-session"
import { requireTier } from "@/lib/payments/subscription-state"

export async function GET() {
  const session = await getServerSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await requireTier(session.user.id, "pro")
    return NextResponse.json({ message: "Access granted" })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 403 })
  }
}
