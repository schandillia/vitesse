import "@/app/styles/globals.css"
import "@/app/styles/switch.css"
import "@/app/styles/theme-transitions.css"
import type { Metadata } from "next"
import { baseMetadata } from "@/lib/metadata"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "react-hot-toast"
import { SessionWatcher } from "@/lib/auth/session-watcher"
import { PostHogProvider } from "@/components/providers/posthog-provider"
import { ConsentProvider } from "@/components/providers/consent-provider"
import { CookieBanner } from "@/components/cookies/cookie-banner"
import { siteConfig } from "@/config/site"
import { JsonLd } from "@/app/json-ld"
import { PreferencesProvider } from "@/components/providers/preferences-provider"
import Script from "next/script"
import { ThemeFlashGuard } from "@/components/layout/theme-flash-guard"
import { themeSyncScript } from "@/lib/scripts/theme-sync"
import { RootProvider } from "fumadocs-ui/provider/next"

export const metadata: Metadata = baseMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased no-transitions"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-sync" strategy="beforeInteractive">
          {themeSyncScript}
        </Script>
        <JsonLd />
        <ConsentProvider>
          <PostHogProvider>
            <PreferencesProvider>
              <ThemeFlashGuard />
              <TooltipProvider>
                {siteConfig.authAndSession.enableSessionWatcher && (
                  <SessionWatcher />
                )}
                <RootProvider>{children}</RootProvider>
                <Toaster position="top-right" />
                <CookieBanner />
              </TooltipProvider>
            </PreferencesProvider>
          </PostHogProvider>
        </ConsentProvider>
      </body>
    </html>
  )
}
