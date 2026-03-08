import { auth } from "@clerk/nextjs/server"
import { db } from "@/index"
import { exercises } from "@/db/schema"

export async function getAllExercises() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return db.select().from(exercises).orderBy(exercises.name)
}
