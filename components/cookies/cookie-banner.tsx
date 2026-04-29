"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { CookieCategories } from "@/components/cookies/cookie-categories"
import { CookieIcon, SettingsIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCookieConsent } from "@/app/hooks/use-cookie-consent"

export function CookieBanner() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const { analytics, setAnalytics, marketing, setMarketing, save } =
    useCookieConsent()

  useEffect(() => {
    async function check() {
      if (pathname === "/cookies" || pathname === "/login") return
      const { getConsent } = await import("@/actions/consent")
      const consent = await getConsent()
      if (!consent) {
        setShow(true)
        setTimeout(() => setVisible(true), 50)
      }
    }
    check()
  }, [pathname])

  async function handleSave(acceptAll?: boolean) {
    await save(acceptAll)
    setVisible(false)
    setTimeout(() => setShow(false), 300)
  }

  if (!show) return null

  return (
    <aside
      className={`
        fixed inset-x-4 bottom-4 z-50 rounded-2xl border bg-background p-4 shadow-xs
        sm:inset-auto sm:right-6 sm:bottom-6 sm:w-full sm:max-w-sm
        transition-all duration-300 ease-in-out
        ${visible ? "opacity-100 translate-x-0" : "opacity-100 translate-x-[calc(100%+24px)]"}
      `}
    >
      <div className="flex items-start gap-3">
        <CookieIcon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <div className="flex-1 text-sm">
          <p className="font-semibold">We value your privacy</p>
          <p className="mt-1 text-muted-foreground">
            We use cookies to enhance your experience and analyze traffic. Read
            our{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-foreground"
            >
              privacy policy
            </Link>
            .
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full"
          onClick={() => handleSave(false)}
          aria-label="Dismiss and reject all cookies"
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      {expanded && (
        <fieldset className="mt-4 rounded-xl border p-3">
          <CookieCategories
            analytics={analytics}
            marketing={marketing}
            onAnalyticsChange={setAnalytics}
            onMarketingChange={setMarketing}
          />
        </fieldset>
      )}

      <div className="mt-4 flex gap-2 items-center">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => handleSave(false)}
        >
          Reject all
        </Button>

        <Button
          size="sm"
          className="flex-1"
          onClick={() => (expanded ? handleSave() : handleSave(true))}
        >
          {expanded ? "Save preferences" : "Accept all"}
        </Button>

        {!expanded && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setExpanded(true)}
            aria-label="Manage cookie preferences"
          >
            <SettingsIcon className="size-4" />
          </Button>
        )}
      </div>
    </aside>
  )
}
