import { NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"

export async function GET() {
  Sentry.captureException(new Error("Sentry test from API route"))
  return NextResponse.json({ message: "Sentry test fired" })
}
