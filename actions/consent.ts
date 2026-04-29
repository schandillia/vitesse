"use server"

import { siteConfig } from "@/config/site"
import { cookies } from "next/headers"

export type Consent = {
  essential: boolean
  analytics: boolean
  marketing: boolean
  updatedAt: string
}

const COOKIE_NAME = `${siteConfig.brand.name.toLowerCase()}_cookie_consent`

export async function getConsent(): Promise<Consent | null> {
  const value = (await cookies()).get(COOKIE_NAME)?.value
  return value ? (JSON.parse(value) as Consent) : null
}

export async function setConsent(
  consent: Omit<Consent, "essential" | "updatedAt">
) {
  const payload: Consent = {
    essential: true,
    ...consent,
    updatedAt: new Date().toISOString(),
  }

  ;(await cookies()).set(COOKIE_NAME, JSON.stringify(payload), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false, // must be readable client-side for banner check
  })
}
