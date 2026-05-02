"use client"

import * as React from "react"
import { PiMoonStars, PiSun } from "react-icons/pi"
import { LuComputer } from "react-icons/lu"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const THEMES = [
  { value: "light", Icon: PiSun },
  { value: "dark", Icon: PiMoonStars },
  { value: "system", Icon: LuComputer },
] as const

interface ModeToggleProps {
  expanded?: boolean
  onThemeChange?: (mode: string) => void
}

export function ModeToggle({
  expanded = false,
  onThemeChange,
}: ModeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  function cycleTheme() {
    const next =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
    setTheme(next)
    onThemeChange?.(next)
  }

  if (!mounted) {
    return expanded ? (
      <div className="h-9 w-[100px] rounded-full bg-sidebar-accent/50 opacity-50" />
    ) : (
      <Button variant="ghost" size="icon" className="opacity-0" />
    )
  }

  if (expanded) {
    return (
      <Tabs value={theme} onValueChange={setTheme}>
        <TabsList className="grid grid-cols-3 rounded-full bg-sidebar-accent/50 p-1">
          {THEMES.map(({ value, Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="cursor-pointer rounded-full p-1 data-[state=active]:bg-background"
              aria-label={`Theme: ${value}`}
              onClick={() => onThemeChange?.(value)}
            >
              <Icon className="size-[18px]" />
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    )
  }

  const baseClass = "text-[18px] transition-all duration-200 ease-in-out"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Theme: ${theme}`}
      title={`Theme: ${theme}`}
      className="relative"
    >
      {THEMES.map(({ value, Icon }) => (
        <Icon
          key={value}
          className={`${baseClass} ${
            theme === value
              ? "scale-100 opacity-100"
              : "absolute scale-75 opacity-0"
          }`}
        />
      ))}
    </Button>
  )
}
