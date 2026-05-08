"use client"

import { useState, useRef, useEffect } from "react"
import { MapPinIcon, PencilIcon, LoaderCircleIcon } from "lucide-react"
import { getPlacesSuggestions, type PlaceSuggestion } from "@/actions/places"

const LOCATION_REGEX = /^[a-zA-Z\s,\-'\.]+$/

interface LocationFieldProps {
  value: string
  onSave: (val: string) => Promise<boolean>
  onError: (msg: string) => void
}

export function LocationField({ value, onSave, onError }: LocationFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [current, setCurrent] = useState(value)
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Click outside → reset
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setCurrent(value)
        setOpen(false)
        setSuggestions([])
        setSelectedIndex(-1)
        setIsEditing(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [value])

  // Debounced search
  const handleChange = (val: string) => {
    setCurrent(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (val.trim().length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      const result = await getPlacesSuggestions(val)
      setLoading(false)

      if (result.success && result.suggestions.length > 0) {
        setSuggestions(result.suggestions)
        setOpen(true)
        setSelectedIndex(-1)
      } else {
        setOpen(false)
      }
    }, 350)
  }

  const handleSelect = async (suggestion: PlaceSuggestion) => {
    const newValue = suggestion.description

    setCurrent(newValue)
    setOpen(false)
    setSuggestions([])
    setIsEditing(false)

    if (newValue === value) return

    const success = await onSave(newValue)
    if (!success) setCurrent(value)
  }

  const handleSave = async () => {
    const cleaned = current.trim()
    setOpen(false)

    if (!cleaned) {
      setIsEditing(false)

      if (cleaned !== value) {
        const success = await onSave("")
        if (!success) setCurrent(value)
      }
      return
    }

    if (!LOCATION_REGEX.test(cleaned)) {
      onError(
        "Only letters, spaces, commas, hyphens, apostrophes and periods are allowed."
      )
      return
    }

    setIsEditing(false)

    if (cleaned === value) return

    const success = await onSave(cleaned)
    if (!success) setCurrent(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setCurrent(value)
      setOpen(false)
      setSuggestions([])
      setSelectedIndex(-1)
      setIsEditing(false)
      return
    }

    if (open && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
        return
      }

      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, -1))
        return
      }
    }

    if (e.key === "Enter") {
      e.preventDefault()

      if (open && selectedIndex >= 0) {
        handleSelect(suggestions[selectedIndex])
      } else {
        handleSave()
      }
    }
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1 py-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wide w-28 shrink-0">
          Location
        </span>

        {isEditing ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              autoFocus
              value={current}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-expanded={open}
              aria-controls="places-listbox"
              aria-autocomplete="list"
              aria-activedescendant={
                selectedIndex >= 0 && suggestions[selectedIndex]
                  ? `place-${suggestions[selectedIndex].placeId}`
                  : undefined
              }
              className="flex-1 text-sm bg-transparent border-0 p-0 outline-none focus-visible:ring-0 focus-visible:outline-none text-foreground placeholder:text-muted-foreground/50"
              placeholder="e.g. Mumbai, India"
            />
            {loading && (
              <LoaderCircleIcon className="size-3 animate-spin text-muted-foreground/50" />
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="group flex flex-1 items-center justify-between gap-4 rounded-sm border-0 outline-none focus-visible:ring-0 text-left cursor-text"
            aria-label="Edit Location"
          >
            <span className="text-sm text-muted-foreground flex-1">
              {current || (
                <span className="text-muted-foreground/40">
                  e.g. Mumbai, India
                </span>
              )}
            </span>
            <PencilIcon className="size-3 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul
          id="places-listbox"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border border-muted/60 bg-popover shadow-md overflow-hidden"
        >
          {suggestions.map((suggestion, index) => {
            const isSelected = selectedIndex === index

            return (
              <li
                key={suggestion.placeId}
                id={`place-${suggestion.placeId}`}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                  isSelected
                    ? "bg-muted/40 text-foreground"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <MapPinIcon className="size-3 opacity-50" />
                {suggestion.description}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
