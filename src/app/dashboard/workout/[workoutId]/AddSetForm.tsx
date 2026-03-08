"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { addSetAction } from "./actions"

interface AddSetFormProps {
  workoutExerciseId: number
  workoutId: number
}

export function AddSetForm({ workoutExerciseId, workoutId }: AddSetFormProps) {
  const [reps, setReps] = useState("")
  const [weight, setWeight] = useState("")
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const repsNum = Number(reps)
    const weightNum = Number(weight)
    if (!repsNum || repsNum < 1 || weightNum < 0) return

    setIsPending(true)
    try {
      await addSetAction(workoutExerciseId, workoutId, repsNum, weightNum)
      setReps("")
      setWeight("")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 mt-2">
      <div className="flex flex-col gap-1">
        <Label htmlFor={`reps-${workoutExerciseId}`} className="text-xs">횟수</Label>
        <Input
          id={`reps-${workoutExerciseId}`}
          type="number"
          min={1}
          placeholder="횟수"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-20"
          disabled={isPending}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor={`weight-${workoutExerciseId}`} className="text-xs">무게 (kg)</Label>
        <Input
          id={`weight-${workoutExerciseId}`}
          type="number"
          min={0}
          step={0.5}
          placeholder="무게"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-24"
          disabled={isPending}
        />
      </div>
      <Button type="submit" disabled={isPending || !reps || weight === ""}>
        {isPending ? "추가 중..." : "세트 추가"}
      </Button>
    </form>
  )
}
