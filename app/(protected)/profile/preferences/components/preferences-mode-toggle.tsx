"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { updatePreferredMode } from "@/actions/update-preferred-mode"
import { MODES, type Mode } from "@/lib/auth/modes"
import { cn } from "@/lib/utils"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"

const THEMES = [
  {
    value: MODES.LIGHT,
    label: "Light",
    preview: {
      bg: "bg-gray-50",
      sidebar: "bg-gray-200",
      bar: "bg-gray-300",
    },
  },
  {
    value: MODES.DARK,
    label: "Dark",
    preview: {
      bg: "bg-gray-900",
      sidebar: "bg-gray-950",
      bar: "bg-gray-700",
    },
  },
  {
    value: MODES.SYSTEM,
    label: "System",
    preview: {
      leftBg: "bg-gray-50",
      rightBg: "bg-gray-900",
      leftSidebar: "bg-gray-200",
      rightSidebar: "bg-gray-950",
      leftBar: "bg-gray-300",
      rightBar: "bg-gray-700",
    },
  },
] as const

function PreviewThumbnail({ theme }: { theme: (typeof THEMES)[number] }) {
  if (theme.value === MODES.SYSTEM) {
    const { leftBg, rightBg, leftSidebar, rightSidebar, leftBar, rightBar } =
      theme.preview as {
        leftBg: string
        rightBg: string
        leftSidebar: string
        rightSidebar: string
        leftBar: string
        rightBar: string
      }
    return (
      <div className="rounded-sm overflow-hidden mb-3 h-24 flex border border-border/40">
        {/* Left half — light */}
        <div className={cn("flex flex-1", leftBg)}>
          <div className={cn("w-3 shrink-0", leftSidebar)} />
          <div className="flex-1 p-1.5 space-y-1.5">
            <div className={cn("h-1.5 rounded-sm w-[70%]", leftBar)} />
            <div className={cn("h-1.5 rounded-sm w-[45%]", leftBar)} />
            <div className={cn("h-1.5 rounded-sm w-[70%]", leftBar)} />
            <div className={cn("h-1.5 rounded-sm w-[55%]", leftBar)} />
          </div>
        </div>
        {/* Sharp divider */}
        <div className="w-px bg-border/60 shrink-0" />
        {/* Right half — dark */}
        <div className={cn("flex flex-1", rightBg)}>
          <div className={cn("w-3 shrink-0", rightSidebar)} />
          <div className="flex-1 p-1.5 space-y-1.5">
            <div className={cn("h-1.5 rounded-sm w-[70%]", rightBar)} />
            <div className={cn("h-1.5 rounded-sm w-[45%]", rightBar)} />
            <div className={cn("h-1.5 rounded-sm w-[70%]", rightBar)} />
            <div className={cn("h-1.5 rounded-sm w-[55%]", rightBar)} />
          </div>
        </div>
      </div>
    )
  }

  const { bg, sidebar, bar } = theme.preview as {
    bg: string
    sidebar: string
    bar: string
  }
  return (
    <div
      className={cn(
        "rounded-sm overflow-hidden mb-3 h-24 flex border border-border/40",
        bg
      )}
    >
      <div className={cn("w-5 shrink-0", sidebar)} />
      <div className="flex-1 p-2 space-y-1.5">
        <div className={cn("h-1.5 rounded-sm w-[70%]", bar)} />
        <div className={cn("h-1.5 rounded-sm w-[45%]", bar)} />
        <div className={cn("h-1.5 rounded-sm w-[70%]", bar)} />
        <div className={cn("h-1.5 rounded-sm w-[55%]", bar)} />
      </div>
    </div>
  )
}

interface PreferencesModeToggleProps {
  initialMode: Mode
}

export function PreferencesModeToggle({
  initialMode,
}: PreferencesModeToggleProps) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const { setTheme } = useTheme()

  async function handleChange(value: Mode) {
    setMode(value)
    setTheme(value)
    await updatePreferredMode(value)
  }

  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Display Mode" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {THEMES.map((theme) => {
          const isSelected = mode === theme.value
          return (
            <button
              key={theme.value}
              onClick={() => handleChange(theme.value)}
              className={cn(
                "rounded-xl border p-3 text-left hover:bg-muted/50 transition-all cursor-pointer",
                isSelected
                  ? "border-2 border-primary"
                  : "border border-border hover:border-primary/50"
              )}
            >
              <PreviewThumbnail theme={theme} />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{theme.label}</span>
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                    isSelected
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/40"
                  )}
                >
                  {isSelected && (
                    <svg
                      className="w-2.5 h-2.5 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
