import "@/app/globals.css"
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
import { ThemeProviderWrapper } from "@/components/providers/theme-provider-wrapper"

export const metadata: Metadata = baseMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
  (function() {
    function clearIfCookieExists() {
      var cookie = document.cookie.split('; ').find(function(r) { return r.startsWith('preferred-mode=') });
      if (cookie) { localStorage.removeItem('theme'); }
    }
    clearIfCookieExists();
    window.addEventListener('storage', clearIfCookieExists);
  })();
`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd />
        <ConsentProvider>
          <PostHogProvider>
            <ThemeProviderWrapper>
              <TooltipProvider>
                {siteConfig.authAndSession.enableSessionWatcher && (
                  <SessionWatcher />
                )}
                {children}
                <Toaster position="top-right" />
                <CookieBanner />
              </TooltipProvider>
            </ThemeProviderWrapper>
          </PostHogProvider>
        </ConsentProvider>
      </body>
    </html>
  )
}
