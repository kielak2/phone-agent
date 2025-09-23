"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateFilterChipProps {
  label: string
  value: string
  onApply: (value: string) => void
  onClear: () => void
}

export function DateFilterChip({ label, value, onApply, onClear }: DateFilterChipProps) {
  const [open, setOpen] = useState(false)
  const [temp, setTemp] = useState<string>(value)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [open])

  const pretty = value
    ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : ""

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        size="sm"
        className="h-7 rounded-full border-slate-300 bg-white text-slate-700"
        onClick={() => {
          setTemp(value)
          setOpen((p) => !p)
        }}
      >
        {value ? `${label}: ${pretty}` : `+ ${label}`}
      </Button>

      {open && (
        <div className="absolute z-50 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <Label htmlFor={`${label}-date`} className="w-24 text-sm text-gray-600">
              {label}
            </Label>
            <Input
              id={`${label}-date`}
              type="date"
              value={temp ?? ""}
              onChange={(e) => setTemp(e.target.value)}
              className="w-auto"
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClear()
                setOpen(false)
              }}
            >
              Clear
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onApply(temp || "")
                  setOpen(false)
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

