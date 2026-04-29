"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getConsent, type Consent } from "@/actions/consent"

interface ConsentContextValue {
  consent: Consent | null
  updateConsent: () => Promise<void>
}

const ConsentContext = createContext<ConsentContextValue>({
  consent: null,
  updateConsent: async () => {},
})

export function useConsent() {
  return useContext(ConsentContext)
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<Consent | null>(null)

  async function updateConsent() {
    const current = await getConsent()
    setConsent(current)
  }

  useEffect(() => {
    // Initial load — inline to satisfy linter
    getConsent().then(setConsent)

    // Subsequent updates via event — callback pattern is fine
    const handleConsentUpdate = () => {
      getConsent().then(setConsent)
    }

    window.addEventListener("consentUpdated", handleConsentUpdate)
    return () =>
      window.removeEventListener("consentUpdated", handleConsentUpdate)
  }, [])

  return (
    <ConsentContext.Provider value={{ consent, updateConsent }}>
      {children}
    </ConsentContext.Provider>
  )
}
