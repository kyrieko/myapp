import { auth } from "@clerk/nextjs/server"
import { db } from "@/index"
import { workouts, workoutExercises, exercises, sets } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function getWorkoutById(id: number) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const results = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))

  const workout = results[0]
  if (!workout) throw new Error("Not found")

  return workout
}

export async function updateWorkout(id: number, name: string, date: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const [workout] = await db
    .update(workouts)
    .set({ name, date })
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
    .returning()

  if (!workout) throw new Error("Not found")

  return workout
}

export async function createWorkout(name: string, date: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const [workout] = await db
    .insert(workouts)
    .values({ userId, name, date })
    .returning()

  return workout
}

export async function getWorkoutsForDate(date: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      workoutExerciseId: workoutExercises.id,
      exerciseName: exercises.name,
      setNumber: sets.setNumber,
      reps: sets.reps,
      weight: sets.weight,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(and(eq(workouts.userId, userId), eq(workouts.date, date)))
    .orderBy(workouts.id, workoutExercises.order, sets.setNumber)

  // 평탄한 행을 중첩 구조로 변환
  const workoutMap = new Map<number, {
    id: number
    name: string
    exercises: Map<number, { name: string; sets: { setNumber: number | null; reps: number | null; weight: string | null }[] }>
  }>()

  for (const row of rows) {
    if (!workoutMap.has(row.workoutId)) {
      workoutMap.set(row.workoutId, { id: row.workoutId, name: row.workoutName, exercises: new Map() })
    }
    const workout = workoutMap.get(row.workoutId)!

    if (row.workoutExerciseId !== null && row.exerciseName !== null) {
      if (!workout.exercises.has(row.workoutExerciseId)) {
        workout.exercises.set(row.workoutExerciseId, { name: row.exerciseName, sets: [] })
      }
      const exercise = workout.exercises.get(row.workoutExerciseId)!

      if (row.reps !== null || row.weight !== null) {
        exercise.sets.push({ setNumber: row.setNumber, reps: row.reps, weight: row.weight })
      }
    }
  }

  return Array.from(workoutMap.values()).map((w) => ({
    id: w.id,
    name: w.name,
    exercises: Array.from(w.exercises.values()),
  }))
}
