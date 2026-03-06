"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

// 목업 운동 데이터
const mockWorkouts = [
  {
    id: 1,
    name: "Morning Workout",
    exercises: [
      { name: "Bench Press", sets: 3, reps: 10, weight: 80 },
      { name: "Squat", sets: 4, reps: 8, weight: 100 },
    ],
  },
  {
    id: 2,
    name: "Evening Run",
    exercises: [
      { name: "Treadmill", sets: 1, reps: 1, weight: 0 },
    ],
  },
]

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">대시보드</h1>

      {/* 날짜 선택기 */}
      <div className="mb-8">
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
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
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date)
                  setCalendarOpen(false)
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* 운동 목록 */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">
          {formatDate(selectedDate)} 운동 기록
        </h2>

        {mockWorkouts.length === 0 ? (
          <p className="text-sm text-muted-foreground">이 날 기록된 운동이 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {mockWorkouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-1">
                    {workout.exercises.map((exercise, index) => (
                      <li key={index} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{exercise.name}</span>
                        <span className="text-muted-foreground">
                          {exercise.sets}세트 &times; {exercise.reps}회
                          {exercise.weight > 0 && ` · ${exercise.weight}kg`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
