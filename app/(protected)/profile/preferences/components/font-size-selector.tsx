"use client"

import { useState } from "react"
import { updatePreferredFontSize } from "@/actions/update-preferred-font-size"
import { FONT_SIZES } from "@/lib/auth/font-sizes"
import { useRouter } from "next/navigation"
import { Slider } from "@/components/ui/slider"

const STEPS = [
  { label: "XS", description: "Extra Small", value: String(FONT_SIZES.XS) },
  { label: "S", description: "Small", value: String(FONT_SIZES.S) },
  { label: "M", description: "Medium", value: String(FONT_SIZES.M) },
  { label: "L", description: "Large", value: String(FONT_SIZES.L) },
  { label: "XL", description: "Extra Large", value: String(FONT_SIZES.XL) },
] as const

interface FontSizeSelectorProps {
  initialSize: string
}

export function FontSizeSelector({ initialSize }: FontSizeSelectorProps) {
  const [size, setSize] = useState(initialSize)
  const router = useRouter()

  // Find the numerical index (0 to 4) of the current size
  const currentIndex = STEPS.findIndex((step) => step.value === size)
  // Fallback to 2 (Medium) if something goes wrong
  const safeIndex = currentIndex !== -1 ? currentIndex : 2

  async function handleSliderChange(values: number[]) {
    const newIndex = values[0]
    const newValue = STEPS[newIndex].value

    // Optimistically update the UI instantly
    setSize(newValue)

    // Fire the background updates
    await updatePreferredFontSize(newValue)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Font Size</h2>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-4 w-full max-w-sm">
          {/* Small Aa */}
          <span className="text-sm font-medium select-none text-muted-foreground/80">
            Aa
          </span>

          <Slider
            value={[safeIndex]}
            max={STEPS.length - 1}
            step={1}
            onValueChange={handleSliderChange}
            className="flex-1 cursor-pointer border-2 border-muted-foreground/40 rounded-full"
            aria-label="Adjust font size"
          />

          {/* Large Aa */}
          <span className="text-2xl font-medium select-none text-muted-foreground/80">
            Aa
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          Size selected:{" "}
          <span className="font-medium text-foreground">
            {STEPS[safeIndex].description}
          </span>
        </p>
      </div>
    </div>
  )
}
