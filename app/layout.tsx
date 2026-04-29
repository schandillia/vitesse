import "@/app/globals.css"
import type { Metadata } from "next"
import { baseMetadata } from "@/lib/metadata"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "react-hot-toast"
import { SessionWatcher } from "@/lib/auth/session-watcher"
import { PostHogProvider } from "@/components/providers/posthog-provider"
import { ConsentProvider } from "@/components/providers/consent-provider"
import { CookieBanner } from "@/components/cookies/cookie-banner"
import { siteConfig } from "@/config/site"
import { JsonLd } from "@/app/json-ld"

export const metadata: Metadata = baseMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <JsonLd />
        <ConsentProvider>
          <PostHogProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                {siteConfig.authAndSession.enableSessionWatcher && (
                  <SessionWatcher />
                )}
                {children}
                <Toaster position="top-right" />
                <CookieBanner />
              </TooltipProvider>
            </ThemeProvider>
          </PostHogProvider>
        </ConsentProvider>
      </body>
    </html>
  )
}
