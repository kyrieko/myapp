"use client"

import { Exercise } from "@/db/schema"
import { AddExerciseForm } from "./AddExerciseForm"
import { ExerciseCard } from "./ExerciseCard"

interface WorkoutExerciseWithSets {
  workoutExerciseId: number
  exerciseId: number
  exerciseName: string
  order: number | null
  sets: Array<{ id: number; setNumber: number | null; reps: number | null; weight: string | null }>
}

interface ExerciseLoggerProps {
  workoutId: number
  exercises: WorkoutExerciseWithSets[]
  allExercises: Exercise[]
}

export function ExerciseLogger({ workoutId, exercises, allExercises }: ExerciseLoggerProps) {
  return (
    <div className="space-y-4">
      <AddExerciseForm allExercises={allExercises} workoutId={workoutId} />
      {exercises.map((ex) => (
        <ExerciseCard
          key={ex.workoutExerciseId}
          workoutExerciseId={ex.workoutExerciseId}
          exerciseName={ex.exerciseName}
          workoutId={workoutId}
          sets={ex.sets}
        />
      ))}
    </div>
  )
}
