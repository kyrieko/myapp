# 데이터 페칭 규칙

## 핵심 원칙

**모든 데이터 페칭은 반드시 서버 컴포넌트에서만 이루어져야 한다.**

이는 협상 불가능한 규칙이다. 아래의 방식은 절대 사용하지 않는다:

- Route Handlers (`app/api/` 내의 파일)
- 클라이언트 컴포넌트에서의 `fetch()` 또는 `axios` 호출
- `useEffect` 내의 데이터 페칭
- SWR, React Query, 기타 클라이언트 사이드 페칭 라이브러리
- 그 외 서버 컴포넌트 이외의 모든 데이터 페칭 방식

## 서버 컴포넌트에서만 페칭

```tsx
// 올바른 예시 — 서버 컴포넌트
// app/dashboard/page.tsx
import { getWorkouts } from "@/data/workouts";

export default async function DashboardPage() {
  const workouts = await getWorkouts();
  return <WorkoutList workouts={workouts} />;
}
```

```tsx
// 잘못된 예시 — 클라이언트 컴포넌트에서 페칭 (절대 금지)
"use client";
useEffect(() => {
  fetch("/api/workouts").then(...); // 금지
}, []);
```

## /data 디렉토리 헬퍼 함수

데이터베이스 쿼리는 반드시 `/data` 디렉토리 내의 헬퍼 함수를 통해서만 실행해야 한다.

### 규칙

1. **Drizzle ORM만 사용** — Raw SQL 절대 금지
2. **모든 쿼리는 반드시 현재 로그인한 사용자의 `userId`로 필터링**
3. 헬퍼 함수 내에서 `auth()`를 호출하여 `userId`를 직접 가져온다 — 호출부에서 전달하지 않는다
4. `userId`가 없으면 즉시 오류를 던지거나 빈 값을 반환한다

### 헬퍼 함수 패턴

```ts
// data/workouts.ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkouts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}

export async function getWorkoutById(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const results = await db
    .select()
    .from(workouts)
    .where(eq(workouts.id, id));

  const workout = results[0];

  // 반드시 소유자 확인 — 다른 사용자의 데이터 접근 차단
  if (!workout || workout.userId !== userId) {
    throw new Error("Not found");
  }

  return workout;
}
```

### 보안 요건

- 모든 쿼리는 `.where(eq(table.userId, userId))` 조건을 포함해야 한다
- ID로 단일 레코드를 조회할 때는 반드시 `userId`가 일치하는지 검증한다
- 사용자는 자신의 데이터에만 접근할 수 있어야 한다. 다른 사용자의 데이터가 절대로 노출되어서는 안 된다

## 파일 구조

```
src/
  data/
    workouts.ts       # 워크아웃 관련 쿼리
    exercises.ts      # 운동 종목 관련 쿼리
    sets.ts           # 세트 기록 관련 쿼리
  app/
    dashboard/
      page.tsx        # 서버 컴포넌트 — 데이터를 직접 페칭
```
