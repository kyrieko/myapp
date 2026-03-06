import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DatePicker from "./DatePicker"
import { getWorkoutsForDate } from "@/data/workouts"

// 날짜 포맷 함수 (예: 1st Sep 2025)
function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th"
  switch (day % 10) {
    case 1: return "st"
    case 2: return "nd"
    case 3: return "rd"
    default: return "th"
  }
}

function formatDate(date: Date): string {
  const day = parseInt(format(date, "d"))
  const suffix = getOrdinalSuffix(day)
  return `${day}${suffix} ${format(date, "MMM yyyy")}`
}

interface PageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { date: dateParam } = await searchParams
  const dateString = dateParam ?? format(new Date(), "yyyy-MM-dd")
  const selectedDate = new Date(dateString)

  const workouts = await getWorkoutsForDate(dateString)

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">대시보드</h1>

      {/* 날짜 선택기 */}
      <div className="mb-8">
        <DatePicker selectedDate={selectedDate} />
      </div>

      {/* 운동 목록 */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">
          {formatDate(selectedDate)} 운동 기록
        </h2>

        {workouts.length === 0 ? (
          <p className="text-sm text-muted-foreground">이 날 기록된 운동이 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-1">
                    {workout.exercises.map((exercise, index) => (
                      <li key={index} className="flex flex-col gap-0.5">
                        <span className="font-medium text-sm">{exercise.name}</span>
                        <ul className="flex flex-col gap-0.5 pl-2">
                          {exercise.sets.map((set, setIndex) => (
                            <li key={setIndex} className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>세트 {set.setNumber ?? setIndex + 1}</span>
                              <span>
                                {set.reps !== null && `${set.reps}회`}
                                {set.weight !== null && Number(set.weight) > 0 && ` · ${set.weight}kg`}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
