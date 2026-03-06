"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// 서수 접미사 반환
function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th"
  switch (day % 10) {
    case 1: return "st"
    case 2: return "nd"
    case 3: return "rd"
    default: return "th"
  }
}

// 날짜 포맷 함수 (예: 1st Sep 2025)
function formatDate(date: Date): string {
  const day = parseInt(format(date, "d"))
  const suffix = getOrdinalSuffix(day)
  return `${day}${suffix} ${format(date, "MMM yyyy")}`
}

interface DatePickerProps {
  selectedDate: Date
}

export default function DatePicker({ selectedDate }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  function handleSelect(date: Date | undefined) {
    if (!date) return
    setOpen(false)
    router.push(`?date=${format(date, "yyyy-MM-dd")}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2 sm:w-auto">
          <CalendarIcon className="h-4 w-4" />
          {formatDate(selectedDate)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
