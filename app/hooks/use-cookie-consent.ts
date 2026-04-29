"use client"

import { useEffect, useState } from "react"
import { getConsent, setConsent } from "@/actions/consent"

export function useCookieConsent() {
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const consent = await getConsent()
      if (consent) {
        setAnalytics(consent.analytics)
        setMarketing(consent.marketing)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function save(acceptAll?: boolean) {
    await setConsent({
      analytics:
        acceptAll === true ? true : acceptAll === false ? false : analytics,
      marketing:
        acceptAll === true ? true : acceptAll === false ? false : marketing,
    })
    window.dispatchEvent(new Event("consentUpdated"))
  }

  return { analytics, setAnalytics, marketing, setMarketing, loading, save }
}
