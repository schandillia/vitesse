"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
  from: string | null
  to: string | null
  onChange: (from: string | null, to: string | null) => void
}

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const selected: DateRange = {
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  }

  function handleSelect(range: DateRange | undefined) {
    onChange(
      range?.from ? format(range.from, "yyyy-MM-dd") : null,
      range?.to ? format(range.to, "yyyy-MM-dd") : null
    )
    if (range?.from && range?.to) setOpen(false)
  }

  function handleClear() {
    onChange(null, null)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label="Filter by date range"
          className={cn(
            "w-52 justify-start gap-2 font-normal",
            !selected.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="size-4 shrink-0" aria-hidden="true" />
          {selected.from ? (
            selected.to ? (
              <>
                {format(selected.from, "MMM d")} –{" "}
                {format(selected.to, "MMM d, yyyy")}
              </>
            ) : (
              format(selected.from, "MMM d, yyyy")
            )
          ) : (
            "Pick a date range"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={{ after: new Date() }}
        />
        {(selected.from || selected.to) && (
          <div className="border-t p-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
