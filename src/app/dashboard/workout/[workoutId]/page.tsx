import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWorkoutWithExercisesAndSets } from "@/data/workouts"
import { getAllExercises } from "@/data/exercises"
import { EditWorkoutForm } from "./EditWorkoutForm"
import { ExerciseLogger } from "./ExerciseLogger"

interface EditWorkoutPageProps {
  params: Promise<{ workoutId: string }>
}

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const { workoutId } = await params
  const [workoutData, allExercises] = await Promise.all([
    getWorkoutWithExercisesAndSets(Number(workoutId)),
    getAllExercises(),
  ])

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">운동 수정</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>운동 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <EditWorkoutForm workout={workoutData.workout} />
        </CardContent>
      </Card>
      <h2 className="mb-4 text-xl font-semibold">운동 종목</h2>
      <ExerciseLogger
        workoutId={workoutData.workout.id}
        exercises={workoutData.exercises}
        allExercises={allExercises}
      />
    </main>
  )
}
