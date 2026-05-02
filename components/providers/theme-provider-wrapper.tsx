import { cookies } from "next/headers"
import { MODES } from "@/lib/auth/modes"
import { ThemeProvider } from "@/components/providers/theme-provider"

export async function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const preferredMode = cookieStore.get("preferred-mode")?.value ?? MODES.SYSTEM

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={preferredMode}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
