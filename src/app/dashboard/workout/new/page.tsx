import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NewWorkoutForm } from "./NewWorkoutForm"

export default function NewWorkoutPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">새 운동 만들기</h1>
      <Card>
        <CardHeader>
          <CardTitle>운동 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <NewWorkoutForm />
        </CardContent>
      </Card>
    </main>
  )
}
