"use client"

import { useState } from "react"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddSetForm } from "./AddSetForm"
import { removeExerciseAction, removeSetAction } from "./actions"

interface SetRow {
  id: number
  setNumber: number | null
  reps: number | null
  weight: string | null
}

interface ExerciseCardProps {
  workoutExerciseId: number
  exerciseName: string
  workoutId: number
  sets: SetRow[]
}

export function ExerciseCard({ workoutExerciseId, exerciseName, workoutId, sets }: ExerciseCardProps) {
  const [isPendingRemoveExercise, setIsPendingRemoveExercise] = useState(false)
  const [removingSetId, setRemovingSetId] = useState<number | null>(null)

  async function handleRemoveExercise() {
    setIsPendingRemoveExercise(true)
    try {
      await removeExerciseAction(workoutExerciseId, workoutId)
    } finally {
      setIsPendingRemoveExercise(false)
    }
  }

  async function handleRemoveSet(setId: number) {
    setRemovingSetId(setId)
    try {
      await removeSetAction(setId, workoutId)
    } finally {
      setRemovingSetId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{exerciseName}</CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveExercise}
            disabled={isPendingRemoveExercise}
            className="text-destructive hover:text-destructive"
          >
            삭제
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {sets.length > 0 && (
          <div className="mb-3 space-y-1">
            {sets.map((set) => (
              <div key={set.id} className="flex items-center gap-3 text-sm">
                <span className="w-12 text-muted-foreground">세트 {set.setNumber}</span>
                <span>{set.reps}회</span>
                <span>{set.weight}kg</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSet(set.id)}
                  disabled={removingSetId === set.id}
                  className="ml-auto h-6 px-2 text-xs text-destructive hover:text-destructive"
                >
                  삭제
                </Button>
              </div>
            ))}
          </div>
        )}
        <AddSetForm workoutExerciseId={workoutExerciseId} workoutId={workoutId} />
      </CardContent>
    </Card>
  )
}
