# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 중요: 문서 우선 참조 규칙

> **ALWAYS** — 코드를 생성하기 전에 `/docs` 디렉토리 내의 관련 문서 파일을 **반드시** 먼저 확인한다. 해당 기능이나 컴포넌트와 관련된 문서가 있다면, 그 문서의 규칙과 패턴을 코드에 적용해야 한다.

- docs/ui.md
- docs/data-fetching.md

## Commands

```bash
npm run dev        # 개발 서버 실행 (localhost:3000)
npm run build      # 프로덕션 빌드
npm run lint       # ESLint 실행

npm run db:generate  # Drizzle 마이그레이션 파일 생성
npm run db:migrate   # 마이그레이션 실행
npm run db:studio    # Drizzle Studio 실행 (DB GUI)
```

## 환경 변수

`.env` 파일에 다음이 필요하다:
- `DATABASE_URL` — Neon PostgreSQL 연결 문자열
- Clerk 관련 키 (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` 등)

## 아키텍처

**Next.js 16 App Router** 기반 풀스택 앱.

- `src/app/` — Next.js 페이지 및 레이아웃 (App Router)
- `src/db/schema.ts` — Drizzle ORM 스키마 정의 (단일 진실 공급원)
- `src/index.ts` — DB 클라이언트 초기화 및 내보내기
- `src/proxy.ts` — Clerk 미들웨어 (모든 라우트 보호)

**인증**: Clerk (`@clerk/nextjs`). `src/proxy.ts`의 미들웨어가 전체 앱에 적용된다. `userId`는 `workouts` 테이블에서 `text` 타입으로 저장된다.

**데이터베이스**: Drizzle ORM + Neon PostgreSQL. 스키마는 `src/db/schema.ts`에서만 정의하며, 변경 후 `db:generate` → `db:migrate` 순서로 실행한다.

**DB 스키마 구조**:
- `exercises` — 운동 종목 카탈로그
- `workouts` — 운동 세션 (userId로 사용자 연결)
- `workout_exercises` — 세션과 종목의 junction 테이블
- `sets` — 각 종목의 세트 기록 (reps, weight)

## UI 표준

`docs/ui.md` 참조. 요약:
- **shadcn/ui 컴포넌트만 사용** — 커스텀 컴포넌트 생성 금지
- **날짜 포맷**: `date-fns` 사용, `1st Sep 2025` 형식 (서수 표기)
