# 데이터 뮤테이션 규칙

## 핵심 원칙

모든 데이터 뮤테이션(생성, 수정, 삭제)은 반드시 아래 두 가지 레이어를 통해서만 이루어져야 한다:

1. **`src/data/` 헬퍼 함수** — Drizzle ORM을 통한 DB 접근을 캡슐화
2. **`actions.ts` 서버 액션** — 뮤테이션의 진입점, Zod로 입력 검증

---

## 레이어 1: `/data` 디렉토리 헬퍼 함수

모든 DB 쓰기 작업(insert, update, delete)은 반드시 `src/data/` 디렉토리 내의 헬퍼 함수로 구현한다.

### 규칙

- **Drizzle ORM만 사용** — Raw SQL 절대 금지
- 헬퍼 함수 내에서 `auth()`를 호출하여 `userId`를 직접 가져온다 — 호출부에서 전달하지 않는다
- `userId`가 없으면 즉시 오류를 던진다
- 수정/삭제 시 반드시 `userId`로 소유권을 검증한다 — 다른 사용자의 데이터를 절대 변경해서는 안 된다

### 헬퍼 함수 패턴

```ts
// src/data/workouts.ts
import { auth } from "@clerk/nextjs/server"
import { db } from "@/index"
import { workouts } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function createWorkout(name: string, date: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const [workout] = await db
    .insert(workouts)
    .values({ userId, name, date })
    .returning()

  return workout
}

export async function updateWorkout(id: number, name: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const [workout] = await db
    .update(workouts)
    .set({ name })
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
    .returning()

  if (!workout) throw new Error("Not found")

  return workout
}

export async function deleteWorkout(id: number) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await db
    .delete(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
}
```

---

## 레이어 2: 서버 액션 (`actions.ts`)

모든 서버 액션은 해당 기능과 같은 위치(colocation)에 있는 `actions.ts` 파일에 정의한다.

### 규칙

- 파일명은 반드시 `actions.ts`
- 파일 상단에 `"use server"` 지시어를 선언
- 모든 파라미터는 TypeScript 타입을 명시한다
- `FormData` 타입은 절대 사용하지 않는다 — 항상 명시적인 타입의 파라미터를 사용한다
- 모든 서버 액션은 반드시 **Zod**로 인자를 검증한다
- 검증 통과 후 `src/data/` 헬퍼 함수를 호출한다
- 서버 액션 내에서 직접 DB를 호출하지 않는다

### 서버 액션 패턴

```ts
// src/app/workout/actions.ts
"use server"

import { z } from "zod"
import { createWorkout, updateWorkout, deleteWorkout } from "@/data/workouts"

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export async function createWorkoutAction(name: string, date: string) {
  const parsed = createWorkoutSchema.safeParse({ name, date })
  if (!parsed.success) throw new Error("Invalid input")

  return createWorkout(parsed.data.name, parsed.data.date)
}

const updateWorkoutSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
})

export async function updateWorkoutAction(id: number, name: string) {
  const parsed = updateWorkoutSchema.safeParse({ id, name })
  if (!parsed.success) throw new Error("Invalid input")

  return updateWorkout(parsed.data.id, parsed.data.name)
}

const deleteWorkoutSchema = z.object({
  id: z.number().int().positive(),
})

export async function deleteWorkoutAction(id: number) {
  const parsed = deleteWorkoutSchema.safeParse({ id })
  if (!parsed.success) throw new Error("Invalid input")

  return deleteWorkout(parsed.data.id)
}
```

### 클라이언트에서 호출

```tsx
// src/app/workout/WorkoutForm.tsx
"use client"

import { createWorkoutAction } from "./actions"

export function WorkoutForm() {
  async function handleSubmit() {
    await createWorkoutAction("Morning Lift", "2026-03-06")
  }

  return <button onClick={handleSubmit}>운동 추가</button>
}
```

---

## 금지 사항

- 서버 액션에서 직접 `db`를 import하여 쿼리하는 것 — 반드시 `/data` 헬퍼를 거쳐야 한다
- 서버 액션 파라미터에 `FormData` 타입 사용
- Zod 검증 없이 입력값을 그대로 DB에 전달하는 것
- `actions.ts` 외의 파일에서 뮤테이션 헬퍼를 직접 호출하는 것 (서버 컴포넌트 포함)
- `app/api/` Route Handler를 통한 뮤테이션

---

## 파일 구조

```
src/
  data/
    workouts.ts         # 워크아웃 뮤테이션 헬퍼
    exercises.ts        # 운동 종목 뮤테이션 헬퍼
    sets.ts             # 세트 뮤테이션 헬퍼
  app/
    workout/
      page.tsx          # 서버 컴포넌트
      actions.ts        # 이 라우트의 서버 액션 (colocation)
      WorkoutForm.tsx   # 클라이언트 컴포넌트 — actions.ts 호출
    workout/[id]/
      page.tsx
      actions.ts        # 이 라우트의 서버 액션 (colocation)
```
