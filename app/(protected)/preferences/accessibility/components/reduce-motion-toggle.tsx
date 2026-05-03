"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateReduceMotion } from "@/actions/update-reduce-motion"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ReduceMotionToggleProps {
  initialValue: boolean
}

export function ReduceMotionToggle({ initialValue }: ReduceMotionToggleProps) {
  const [reduceMotion, setReduceMotion] = useState(initialValue)
  const router = useRouter()

  async function handleChange(checked: boolean) {
    setReduceMotion(checked)
    await updateReduceMotion(checked)
    router.refresh()
  }

  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Motion" />
      <div className="flex items-center justify-between max-w-2xl rounded-xl border border-border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="reduce-motion" className="text-sm font-medium">
            Reduce motion
          </Label>
          <p className="text-sm text-muted-foreground">
            Minimizes animations and transitions across the interface
          </p>
        </div>
        <Switch
          id="reduce-motion"
          checked={reduceMotion}
          onCheckedChange={handleChange}
          className="cursor-pointer"
        />
      </div>
    </div>
  )
}
