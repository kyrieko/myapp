"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { updateWorkout } from "@/data/workouts"

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
