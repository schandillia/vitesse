"use client"

import { PiMoonStars, PiSun } from "react-icons/pi"
import { LuComputer } from "react-icons/lu"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  function cycleTheme() {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
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
      {/* Sun */}
      <PiSun
        className={`${baseClass} ${
          theme === "light"
            ? "scale-100 opacity-100"
            : "absolute scale-75 opacity-0"
        }`}
      />

      {/* Moon */}
      <PiMoonStars
        className={`${baseClass} ${
          theme === "dark"
            ? "scale-100 opacity-100"
            : "absolute scale-75 opacity-0"
        }`}
      />

      {/* System */}
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
