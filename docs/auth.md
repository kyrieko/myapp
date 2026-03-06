# 인증 코딩 표준

## 인증 라이브러리

- 이 앱은 **Clerk**을 인증 라이브러리로 사용한다.
- 다른 인증 라이브러리(NextAuth, Auth.js 등)를 절대 사용하지 않는다.

## 미들웨어

- 인증 미들웨어는 `src/proxy.ts`에 정의되어 있다.
- `clerkMiddleware()`를 사용하여 모든 라우트를 보호한다.
- 미들웨어 설정은 Next.js 내부 파일 및 정적 파일을 자동으로 제외한다.

```ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();
```

## 레이아웃 설정

- 루트 레이아웃(`src/app/layout.tsx`)에서 전체 앱을 `<ClerkProvider>`로 감싼다.
- `<ClerkProvider>`는 반드시 최상위 레이아웃에 위치해야 한다.

```tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

## UI 컴포넌트

Clerk에서 제공하는 UI 컴포넌트를 사용한다.

| 컴포넌트 | 용도 |
|---|---|
| `<SignedIn>` | 로그인한 사용자에게만 렌더링 |
| `<SignedOut>` | 로그아웃 상태의 사용자에게만 렌더링 |
| `<SignInButton>` | 로그인 버튼 (mode="modal" 사용) |
| `<SignUpButton>` | 회원가입 버튼 (mode="modal" 사용) |
| `<UserButton>` | 사용자 프로필/로그아웃 버튼 |

```tsx
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
```

## 서버 사이드 인증

- 서버 컴포넌트 및 서버 액션에서는 `auth()`를 사용하여 `userId`를 가져온다.
- `auth()`는 `@clerk/nextjs/server`에서 import한다.
- `userId`가 없으면 반드시 `Unauthorized` 에러를 던진다.

```ts
import { auth } from "@clerk/nextjs/server";

export async function someServerFunction() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // userId를 사용한 데이터 조회...
}
```

## 데이터베이스에서 userId 사용

- `userId`는 Clerk에서 제공하는 문자열 값이다.
- DB 스키마에서 `userId` 컬럼은 `text` 타입으로 정의한다.
- 데이터 조회 시 항상 `userId`로 필터링하여 사용자 데이터를 격리한다.

```ts
// workouts 테이블에서 현재 사용자의 데이터만 조회
.where(and(eq(workouts.userId, userId), ...))
```

## 환경 변수

Clerk 동작에 필요한 환경 변수는 `.env` 파일에 설정한다.

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```
