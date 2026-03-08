"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { updateWorkout } from "@/data/workouts"
import { addWorkoutExercise, removeWorkoutExercise } from "@/data/workoutExercises"
import { addSet, removeSet } from "@/data/sets"

const updateWorkoutSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  datetime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
})

export async function updateWorkoutAction(id: number, name: string, datetime: string) {
  const parsed = updateWorkoutSchema.safeParse({ id, name, datetime })
  if (!parsed.success) throw new Error("Invalid input")

  const date = parsed.data.datetime.slice(0, 10)
  await updateWorkout(parsed.data.id, parsed.data.name, date)
  redirect(`/dashboard?date=${date}`)
}

const idSchema = z.number().int().positive()
const repsSchema = z.number().int().min(1)
const weightSchema = z.number().min(0)

export async function addExerciseAction(workoutId: number, exerciseId: number) {
  idSchema.parse(workoutId)
  idSchema.parse(exerciseId)
  await addWorkoutExercise(workoutId, exerciseId)
  revalidatePath(`/dashboard/workout/${workoutId}`)
}

export async function removeExerciseAction(workoutExerciseId: number, workoutId: number) {
  idSchema.parse(workoutExerciseId)
  idSchema.parse(workoutId)
  await removeWorkoutExercise(workoutExerciseId)
  revalidatePath(`/dashboard/workout/${workoutId}`)
}

export async function addSetAction(workoutExerciseId: number, workoutId: number, reps: number, weight: number) {
  idSchema.parse(workoutExerciseId)
  idSchema.parse(workoutId)
  repsSchema.parse(reps)
  weightSchema.parse(weight)
  await addSet(workoutExerciseId, reps, weight)
  revalidatePath(`/dashboard/workout/${workoutId}`)
}

export async function removeSetAction(setId: number, workoutId: number) {
  idSchema.parse(setId)
  idSchema.parse(workoutId)
  await removeSet(setId)
  revalidatePath(`/dashboard/workout/${workoutId}`)
}
