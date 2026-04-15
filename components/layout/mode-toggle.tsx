"use client"

import * as React from "react"
import { PiMoonStars, PiSun } from "react-icons/pi"
import { LuComputer } from "react-icons/lu"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ModeToggleProps {
  expanded?: boolean
}

export function ModeToggle({ expanded = false }: ModeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  function cycleTheme() {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  if (!mounted) {
    // Return an invisible placeholder that matches the exact dimensions
    return expanded ? (
      <div className="h-9 w-full rounded-md bg-sidebar-accent/50 opacity-50" />
    ) : (
      <Button variant="ghost" size="icon" className="opacity-0" />
    )
  }

  // 2. Now it is safe to render the Tabs because we are on the client
  if (expanded) {
    return (
      <Tabs value={theme} onValueChange={(val) => setTheme(val)}>
        <TabsList className="grid grid-cols-3 bg-sidebar-accent/50 p-1 rounded-full">
          <TabsTrigger
            value="light"
            className="data-[state=active]:bg-background rounded-full  p-1"
          >
            <PiSun className="size-[18px]" />
          </TabsTrigger>
          <TabsTrigger
            value="dark"
            className="data-[state=active]:bg-background rounded-full  p-1"
          >
            <PiMoonStars className="size-[18px]" />
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="data-[state=active]:bg-background rounded-full p-1"
          >
            <LuComputer className="size-[18px]" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    )
  }

  const baseClass = "text-[18px] transition-all duration-200 ease-in-out"

  // 3. Render collapsed icon button
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Theme: ${theme}`}
      title={`Theme: ${theme}`}
      className="relative"
    >
      <PiSun
        className={`${baseClass} ${
          theme === "light"
            ? "scale-100 opacity-100"
            : "absolute scale-75 opacity-0"
        }`}
      />
      <PiMoonStars
        className={`${baseClass} ${
          theme === "dark"
            ? "scale-100 opacity-100"
            : "absolute scale-75 opacity-0"
        }`}
      />
      <LuComputer
        className={`${baseClass} ${
          theme === "system"
            ? "scale-100 opacity-100"
            : "absolute scale-75 opacity-0"
        }`}
      />
    </Button>
  )
}
