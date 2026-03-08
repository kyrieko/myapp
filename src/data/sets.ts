import { auth } from "@clerk/nextjs/server"
import { db } from "@/index"
import { workouts, workoutExercises, sets } from "@/db/schema"
import { eq, and, max } from "drizzle-orm"

export async function addSet(workoutExerciseId: number, reps: number, weight: number) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // 소유권 체인 확인
  const [row] = await db
    .select({ workoutUserId: workouts.userId })
    .from(workoutExercises)
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(and(eq(workoutExercises.id, workoutExerciseId), eq(workouts.userId, userId)))
  if (!row) throw new Error("Not found")

  // 다음 setNumber 계산
  const [result] = await db
    .select({ maxSetNumber: max(sets.setNumber) })
    .from(sets)
    .where(eq(sets.workoutExerciseId, workoutExerciseId))
  const nextSetNumber = (result?.maxSetNumber ?? 0) + 1

  const [inserted] = await db
    .insert(sets)
    .values({ workoutExerciseId, setNumber: nextSetNumber, reps, weight: String(weight) })
    .returning()

  return inserted
}

export async function removeSet(setId: number) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // 소유권 체인 확인
  const [row] = await db
    .select({ workoutUserId: workouts.userId })
    .from(sets)
    .innerJoin(workoutExercises, eq(workoutExercises.id, sets.workoutExerciseId))
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(and(eq(sets.id, setId), eq(workouts.userId, userId)))
  if (!row) throw new Error("Not found")

  await db.delete(sets).where(eq(sets.id, setId))
}
