import { auth } from "@clerk/nextjs/server"
import { db } from "@/index"
import { workouts, workoutExercises, sets } from "@/db/schema"
import { eq, and, max } from "drizzle-orm"

export async function addWorkoutExercise(workoutId: number, exerciseId: number) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // 소유권 확인
  const [workout] = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
  if (!workout) throw new Error("Not found")

  // 다음 order 계산
  const [result] = await db
    .select({ maxOrder: max(workoutExercises.order) })
    .from(workoutExercises)
    .where(eq(workoutExercises.workoutId, workoutId))
  const nextOrder = (result?.maxOrder ?? 0) + 1

  const [inserted] = await db
    .insert(workoutExercises)
    .values({ workoutId, exerciseId, order: nextOrder })
    .returning()

  return inserted
}

export async function removeWorkoutExercise(workoutExerciseId: number) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // 소유권 체인 확인
  const [row] = await db
    .select({ workoutUserId: workouts.userId })
    .from(workoutExercises)
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(eq(workoutExercises.id, workoutExerciseId))
  if (!row || row.workoutUserId !== userId) throw new Error("Not found")

  // FK cascade 없으므로 세트 먼저 삭제
  await db.delete(sets).where(eq(sets.workoutExerciseId, workoutExerciseId))
  await db.delete(workoutExercises).where(eq(workoutExercises.id, workoutExerciseId))
}
