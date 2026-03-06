# UI 코딩 표준

## 컴포넌트

- **shadcn/ui 컴포넌트만 사용한다.**
- 커스텀 컴포넌트를 절대 생성하지 않는다.
- 필요한 UI 요소가 있다면 반드시 shadcn/ui에서 제공하는 컴포넌트를 사용한다.
- shadcn/ui에서 제공하지 않는 기능은 해당 컴포넌트를 조합하여 구현한다.

### shadcn/ui 컴포넌트 추가 방법

```bash
npx shadcn@latest add <component-name>
```

## 날짜 포맷

- 날짜 포맷은 **date-fns** 라이브러리를 사용한다.
- 날짜 표시 형식은 다음과 같이 서수(ordinal) 형태를 사용한다.

### 형식 예시

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

### 구현 예시

```js
import { format } from 'date-fns'

// 서수 접미사 반환
function getOrdinalSuffix(day) {
  if (day >= 11 && day <= 13) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

// 날짜 포맷 함수
function formatDate(date) {
  const day = format(date, 'd')
  const suffix = getOrdinalSuffix(parseInt(day))
  return `${day}${suffix} ${format(date, 'MMM yyyy')}`
}

// 사용 예시
formatDate(new Date('2025-09-01')) // "1st Sep 2025"
formatDate(new Date('2025-08-02')) // "2nd Aug 2025"
formatDate(new Date('2026-01-03')) // "3rd Jan 2026"
formatDate(new Date('2024-06-04')) // "4th Jun 2024"
```
