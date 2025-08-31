"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange: (date: Date | undefined) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
}

export function DatePicker({
  date,
  onDateChange,
  label,
  placeholder = "Select date",
  disabled = false,
  minDate,
  maxDate,
  className
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {label && (
        <Label className="px-1">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal"
            disabled={disabled}
          >
            {date ? date.toLocaleDateString() : placeholder}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              onDateChange(selectedDate)
              setOpen(false)
            }}
            disabled={(date) => {
              if (minDate && date < minDate) return true
              if (maxDate && date > maxDate) return true
              return false
            }}
            captionLayout="dropdown"
            fromYear={2020}
            toYear={2030}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
