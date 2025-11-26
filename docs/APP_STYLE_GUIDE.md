# EscapeHint 애플리케이션 스타일 가이드

UI/UX 디자이너: YIS (Your Intelligent Solution)

## 1. 컬러 팔레트

### Primary Colors (Escape Room 관련 색상)
- `primary-50`: #f0f9ff
- `primary-100`: #e0f2fe
- `primary-200`: #bae6fd
- `primary-300`: #7dd3fc
- `primary-400`: #38bdf8
- `primary-500`: #0ea5e9 (에스케이프 룸 서비스 대표 색상)
- `primary-600`: #0284c7
- `primary-700`: #0369a1
- `primary-800`: #075985
- `primary-900`: #0c4a6e

### Secondary Colors (Hint 관련 색상)
- `secondary-50`: #f5f3ff
- `secondary-100`: #ede9fe
- `secondary-200`: #ddd6fe
- `secondary-300`: #c4b5fd
- `secondary-400`: #a78bfa
- `secondary-500`: #8b5cf6 (힌트 기능 대표 색상)
- `secondary-600`: #7c3aed
- `secondary-700`: #6d28d9
- `secondary-800`: #5b21b6
- `secondary-900`: #4c1d95

### Accent Colors (게임 진행 상태 색상)
- `accent-yellow-50`: #fffbeb
- `accent-yellow-100`: #fef3c7
- `accent-yellow-200`: #fde68a
- `accent-yellow-300`: #fcd34d
- `accent-yellow-400`: #fbbf24
- `accent-yellow-500`: #f59e0b (진행 중 상태)
- `accent-yellow-600`: #d97706
- `accent-yellow-700`: #b45309
- `accent-yellow-800`: #92400e
- `accent-yellow-900`: #78350f

- `accent-green-50`: #f0fdf4
- `accent-green-100`: #dcfce7
- `accent-green-200`: #bbf7d0
- `accent-green-300`: #86efac
- `accent-green-400`: #4ade80
- `accent-green-500`: #22c55e (클리어 상태)
- `accent-green-600`: #16a34a
- `accent-green-700`: #15803d
- `accent-green-800`: #166534
- `accent-green-900`: #14532d

- `accent-red-50`: #fef2f2
- `accent-red-100`: #fee2e2
- `accent-red-200`: #fecaca
- `accent-red-300`: #fca5a5
- `accent-red-400`: #f87171
- `accent-red-500`: #ef4444 (실패/경고 상태)
- `accent-red-600`: #dc2626
- `accent-red-700`: #b91c1c
- `accent-red-800`: #991b1b
- `accent-red-900`: #7f1d1d

### Neutral Colors
- `neutral-50`: #fafafa
- `neutral-100`: #f5f5f5
- `neutral-200`: #e5e5e5
- `neutral-300`: #d4d4d4
- `neutral-400`: #a3a3a3
- `neutral-500`: #737373
- `neutral-600`: #525252
- `neutral-700`: #404040
- `neutral-800`: #262626
- `neutral-900`: #171717

### Status Colors
- `success`: #10b981 (초록)
- `warning`: #f59e0b (노랑)
- `error`: #ef4444 (빨강)
- `info`: #3b82f6 (파랑)

## 2. 타이포그래피

### 폰트 스택
```css
font-family: 'Pretendard', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
```

### 헤딩 스타일
- `h1`: `text-4xl` (36px) font-bold
- `h2`: `text-3xl` (30px) font-bold
- `h3`: `text-2xl` (24px) font-semibold
- `h4`: `text-xl` (20px) font-semibold
- `h5`: `text-lg` (18px) font-medium
- `h6`: `text-base` (16px) font-medium

### 본문 텍스트
- `text-base`: 16px, leading-relaxed
- `text-sm`: 14px, leading-normal
- `text-xs`: 12px, leading-tight

## 3. 버튼 스타일

### Primary Button (에스케이프 룸 관련)
- `bg-primary-500 text-white`
- `hover:bg-primary-600`
- `py-3 px-6 rounded-lg`
- `font-semibold shadow-md`
- `transition duration-200 ease-in-out`
- `active:scale-95`

### Secondary Button (힌트 관련)
- `bg-secondary-500 text-white`
- `hover:bg-secondary-600`
- `py-3 px-6 rounded-lg`
- `font-semibold shadow-md`
- `transition duration-200 ease-in-out`
- `active:scale-95`

### Outline Button
- `border-2 border-primary-500 text-primary-500`
- `bg-transparent`
- `hover:bg-primary-50 hover:text-primary-700`
- `py-2 px-4 rounded-lg`
- `font-medium`

### Ghost Button
- `bg-transparent text-gray-700`
- `hover:bg-gray-100`
- `py-2 px-4 rounded-lg`
- `font-medium`

### Disabled Button
- `bg-gray-300 text-gray-500 cursor-not-allowed`
- `shadow-none`

## 4. 폼 요소

### Input Field
- `w-full px-4 py-3 rounded-lg border border-gray-300 bg-white`
- `focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`
- `placeholder:text-gray-400`
- `transition duration-200 ease-in-out`

### Textarea
- `w-full px-4 py-3 rounded-lg border border-gray-300 bg-white`
- `focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`
- `min-height: 120px`
- `resize: vertical`

### Select
- `w-full px-4 py-3 rounded-lg border border-gray-300 bg-white appearance-none`
- `focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`
- `pr-10` (화살표 공간 확보)

## 5. 카드 컴포넌트

### 기본 카드
- `bg-white rounded-2xl shadow-lg overflow-hidden`
- `border border-gray-200`

### 카드 헤더
- `p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50`

### 카드 본문
- `p-6`

### 카드 푸터
- `p-6 border-t border-gray-200 bg-gray-50`

## 6. 레이아웃

### 메인 컨테이너
- `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### 그리드 시스템
- 모바일 우선: `grid grid-cols-1 gap-6`
- 태블릿: `md:grid-cols-2`
- 데스크탑: `lg:grid-cols-3 xl:grid-cols-4`

## 7. 간격 (Spacing)
- `space-x-*` 및 `space-y-*` 유틸리티 사용
- `p-*`, `m-*`는 4px 단위 (1 = 4px, 2 = 8px 등)
- 공통 간격: `p-4`, `p-5`, `p-6`, `m-4`, `m-5`, `m-6`
- 버튼 내부 간격: `py-3 px-6`
- 섹션 간 간격: `py-12`

## 8. 그림자
- `shadow-sm`: 가벼운 그림자
- `shadow`: 기본 그림자
- `shadow-md`: 중간 그림자
- `shadow-lg`: 더 진한 그림자
- `shadow-xl`: 매우 진한 그림자
- `shadow-inner`: 내부 그림자

## 9. 반응형 디자인

### 브레이크포인트
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### 모바일 우선 접근
- 기본 스타일은 모바일용
- 미디어 쿼리: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

## 10. 에스케이프 룸 특화 컴포넌트

### 방 정보 카드
- `bg-white rounded-2xl shadow-lg overflow-hidden`
- `transition-all duration-300 ease-in-out`
- `hover:shadow-xl hover:-translate-y-1`

### 힌트 패널
- `bg-gradient-to-br from-secondary-100 to-primary-50 rounded-xl p-5`
- `border-l-4 border-secondary-500`

### 게임 진행 상태 표시기
- `flex items-center justify-between`
- `bg-gray-100 rounded-full h-4 overflow-hidden`
- `w-full max-w-md`

### 타이머 컴포넌트
- `font-mono text-2xl font-bold text-center`
- `text-accent-red-600`
- `p-4 bg-black bg-opacity-5 rounded-lg`

### 결과 패널
- `bg-gradient-to-r from-accent-green-100 to-accent-yellow-100 rounded-2xl p-8`
- `text-center shadow-lg`

## 11. 애니메이션 및 전환 효과

### 트랜지션
- `transition-all duration-300 ease-in-out`

### 커스텀 애니메이션
- `pulse`: `animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`
- `bounce`: `animation: bounce 1s infinite`
- `shake`: `animation: shake 0.5s linear`

## 12. 접근성 가이드라인

- 모든 인터랙티브 요소는 최소 44px 터치 대상 크기
- 텍스트와 배경 간 대비 비율은 최소 4.5:1
- 키보드 네비게이션 지원 (tab-index, focus 스타일)
- 스크린 리더 호환을 위한 ARIA 라벨 사용