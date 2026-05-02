import { cookies } from "next/headers"
import { ThemeProvider } from "@/components/providers/theme-provider"

export async function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const preferredFontSize =
    cookieStore.get("preferred-font-size")?.value ?? "16"

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <style>{`html { font-size: ${preferredFontSize}px; }`}</style>
      {children}
    </ThemeProvider>
  )
}
