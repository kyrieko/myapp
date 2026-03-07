# 라우팅 규칙

## 기본 원칙

- 모든 앱 기능은 `/dashboard` 경로 하위에 위치한다.
- `/dashboard` 및 모든 하위 페이지는 로그인한 사용자만 접근 가능한 보호된 라우트다.
- 라우트 보호는 **Next.js 미들웨어**(`src/proxy.ts`)를 통해 처리한다. 개별 페이지에서 인증을 체크하지 않는다.

## 라우트 구조

```
/                        → 랜딩 페이지 (공개)
/dashboard               → 대시보드 메인 (보호)
/dashboard/workout/new   → 새 운동 세션 생성 (보호)
/dashboard/workout/[workoutId]  → 운동 세션 상세/수정 (보호)
```

## 미들웨어 설정

라우트 보호는 `src/proxy.ts`의 Clerk 미들웨어로 처리한다.

```ts
// src/proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

- `clerkMiddleware()`는 기본적으로 모든 라우트에 실행되지만 자동으로 보호하지는 않는다.
- `/dashboard` 하위 라우트를 보호하려면 미들웨어 내에서 `auth().protect()` 또는 `createRouteMatcher`를 사용해 명시적으로 보호 대상을 지정한다.

### 보호 라우트 설정 예시

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});
```

## 규칙 요약

| 규칙 | 내용 |
|------|------|
| 보호 방식 | 미들웨어(`src/proxy.ts`)에서만 처리 |
| 보호 대상 | `/dashboard` 및 모든 하위 경로 |
| 페이지 내 인증 체크 | 금지 — 미들웨어에 위임 |
| 새 라우트 추가 시 | `/dashboard` 하위에 배치 |
