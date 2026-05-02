"use client"

import { useState } from "react"
import { updatePreferredFontSize } from "@/actions/update-preferred-font-size"
import { FONT_SIZES } from "@/lib/auth/font-sizes"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const STEPS = [
  { label: "XS", value: String(FONT_SIZES.XS) },
  { label: "S", value: String(FONT_SIZES.S) },
  { label: "M", value: String(FONT_SIZES.M) },
  { label: "L", value: String(FONT_SIZES.L) },
  { label: "XL", value: String(FONT_SIZES.XL) },
] as const

interface FontSizeSelectorProps {
  initialSize: string
}

export function FontSizeSelector({ initialSize }: FontSizeSelectorProps) {
  const [size, setSize] = useState(initialSize)
  const router = useRouter()

  async function handleChange(value: string) {
    setSize(value)
    await updatePreferredFontSize(value)
    router.refresh()
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium">Font Size</h2>
      <div className="flex items-center gap-1 p-1 rounded-full border border-border w-fit">
        {STEPS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleChange(value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm transition-all",
              size === value
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
