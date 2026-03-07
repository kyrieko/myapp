"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { createWorkout } from "@/data/workouts"

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  datetime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
})

export async function createWorkoutAction(name: string, datetime: string) {
  const parsed = createWorkoutSchema.safeParse({ name, datetime })
  if (!parsed.success) throw new Error("Invalid input")

  const date = parsed.data.datetime.slice(0, 10)
  await createWorkout(parsed.data.name, date)
  redirect(`/dashboard?date=${date}`)
}
