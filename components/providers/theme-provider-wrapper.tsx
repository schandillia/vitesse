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
  const reduceMotion = cookieStore.get("reduce-motion")?.value === "true"

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <style>{`
  html { font-size: ${preferredFontSize}px; }
${
  reduceMotion
    ? `
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
`
    : ""
}
`}</style>
      {children}
    </ThemeProvider>
  )
}
