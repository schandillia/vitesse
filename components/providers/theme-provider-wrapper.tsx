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
  const preferredFontSize =
    cookieStore.get("preferred-font-size")?.value ?? "16"

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={preferredMode}
      enableSystem
      disableTransitionOnChange
    >
      <style>{`html { font-size: ${preferredFontSize}px; }`}</style>
      {children}
    </ThemeProvider>
  )
}
