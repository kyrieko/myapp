"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createWorkoutAction } from "./actions"

interface NewWorkoutFormProps {
  initialDate?: string
}

export function NewWorkoutForm({ initialDate }: NewWorkoutFormProps) {
  const [name, setName] = useState("")
  const [datetime, setDatetime] = useState(
    initialDate ? `${initialDate}T00:00` : ""
  )

  useEffect(() => {
    const now = new Date()
    setDatetime(
      initialDate
        ? `${initialDate}T${format(now, "HH:mm")}`
        : format(now, "yyyy-MM-dd'T'HH:mm")
    )
  }, [])
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsPending(true)
    try {
      await createWorkoutAction(name, datetime)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">운동 이름</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 오전 운동"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="datetime">날짜 및 시간</Label>
        <Input
          id="datetime"
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "저장 중..." : "운동 만들기"}
      </Button>
    </form>
  )
}
