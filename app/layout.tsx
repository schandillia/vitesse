import type { Metadata } from "next"
import "./globals.css"
import { siteConfig } from "@/config/site"
import { ThemeProvider } from "@/components/providers/theme-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.metaData.home.title,
    template: `%s | ${siteConfig.metaData.home.title}`,
  },
  description: siteConfig.metaData.home.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
