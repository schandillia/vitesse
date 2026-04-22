import { NextResponse } from "next/server"

export async function GET() {
  throw new Error(`Sentry Backend Test - Amit`)
  return NextResponse.json({ status: `success` }) // This will never execute
}
