import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWorkoutById } from "@/data/workouts"
import { EditWorkoutForm } from "./EditWorkoutForm"

interface EditWorkoutPageProps {
  params: Promise<{ workoutId: string }>
}

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const { workoutId } = await params
  const workout = await getWorkoutById(Number(workoutId))

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">운동 수정</h1>
      <Card>
        <CardHeader>
          <CardTitle>운동 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <EditWorkoutForm workout={workout} />
        </CardContent>
      </Card>
    </main>
  )
}
