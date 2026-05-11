"use client"

import * as React from "react"
import { Clock8Icon } from "lucide-react"
import { Input } from "@/components/ui/input"

interface TimePickerProps {
  value: string // "HH:mm"
  onChange: (value: string) => void
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  return (
    <div className="relative">
      <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
        <Clock8Icon className="size-4" />
      </div>
      <Input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-background pl-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none w-[130px]"
      />
    </div>
  )
}
