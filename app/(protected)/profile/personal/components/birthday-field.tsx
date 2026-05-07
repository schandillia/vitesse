"use client"

import { useState, useEffect } from "react"
import { format, parseISO, isValid } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface BirthdayFieldProps {
  value: string // "YYYY-MM-DD" or ""
  // Updated to expect a boolean return from the parent
  onSave: (val: string) => Promise<boolean>
}

export function BirthdayField({ value, onSave }: BirthdayFieldProps) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(value) // Local state for optimistic updates

  // Keep local state in sync if the parent value changes (e.g., via router.refresh)
  useEffect(() => {
    setCurrent(value)
  }, [value])

  const parsed = current ? parseISO(current) : undefined
  const selected = parsed && isValid(parsed) ? parsed : undefined

  async function handleSelect(day: Date | undefined) {
    setOpen(false)
    if (!day) return

    const iso = format(day, "yyyy-MM-dd")
    if (iso === current) return

    // Optimistically update the UI so the user sees their selection immediately
    setCurrent(iso)

    // Attempt to save to the database
    const success = await onSave(iso)

    // If the database update fails, revert to the last known good value from props
    if (!success) {
      setCurrent(value)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-muted/40 last:border-0">
      <span className="text-xs text-muted-foreground uppercase tracking-wide w-28 shrink-0">
        Date of Birth
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="cursor-pointer group flex flex-1 items-center justify-between gap-4 rounded-sm outline-none text-left"
            aria-label="Edit Date of Birth"
          >
            <span className="text-sm text-muted-foreground flex-1">
              {selected ? (
                format(selected, "MMMM d, yyyy")
              ) : (
                <span className="text-muted-foreground/40">Pick a date</span>
              )}
            </span>
            <CalendarIcon
              className="size-3 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground opacity-30"
              aria-hidden="true"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            defaultMonth={selected ?? new Date(1990, 0)}
            captionLayout="dropdown"
            startMonth={new Date(1900, 0)}
            endMonth={new Date(new Date().getFullYear(), 11)}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
