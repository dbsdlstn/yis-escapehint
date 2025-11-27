# EscapeHint - 모바일 앱 스타일 가이드 (Tailwind CSS 기반)

## 문서 정보

| 항목            | 내용                                    |
| --------------- | --------------------------------------- |
| **문서 버전**   | 1.0                                     |
| **작성일**      | 2025-11-27                              |
| **작성자**      | UI Designer                             |
| **문서 상태**   | 최종 승인                               |
| **관련 문서**   | [PRD 문서](./3-prd.md)                  |
| **디자인 기준** | 제공된 모바일 화면 이미지 분석          |

---

## 1. 색상 시스템 (Color Palette)

### 1.1 Primary Colors

```javascript
// tailwind.config.js
colors: {
  // 메인 배경 - 다크 그라데이션
  'dark-primary': '#1a1a1a',
  'dark-secondary': '#2d2d2d',
  'dark-gradient-start': '#1a1a1a',
  'dark-gradient-end': '#0a0a0a',

  // 악센트 컬러 - 원형 프로그레스바
  'accent-white': '#ffffff',
  'accent-light': '#f5f5f5',
}
```

**Tailwind 클래스 예시:**
```html
<div class="bg-gradient-to-b from-dark-gradient-start to-dark-gradient-end">
```

### 1.2 Text Colors (계층 구조)

```javascript
colors: {
  // 텍스트 계층
  'text-primary': '#ffffff',      // 주요 텍스트 (타이머, 제목)
  'text-secondary': '#e5e5e5',    // 부가 정보 (Hint 12/999)
  'text-tertiary': '#a0a0a0',     // 보조 텍스트 (Start, End)
  'text-muted': '#6b7280',        // 비활성 상태
}
```

**사용 예시:**
- 타이머: `text-text-primary`
- 힌트 카운트: `text-text-secondary`
- Start/End 라벨: `text-text-tertiary`

### 1.3 Border Colors

```javascript
colors: {
  'border-light': '#404040',      // 입력 박스 테두리
  'border-accent': '#ffffff',     // 원형 프로그레스바
  'border-focus': '#ffffff',      // 포커스 상태
}
```

### 1.4 Background Colors

```javascript
colors: {
  // 배경 레이어
  'bg-dark': '#1a1a1a',           // 메인 배경
  'bg-overlay': 'rgba(0, 0, 0, 0.5)', // 오버레이
  'bg-button': '#ffffff',         // MEMO 버튼 배경
  'bg-input': 'transparent',      // 입력 박스 (투명)
}
```

---

## 2. 타이포그래피 (Typography)

### 2.1 폰트 크기 체계

```javascript
// tailwind.config.js
fontSize: {
  // 타이머
  'timer-main': ['3.5rem', { lineHeight: '1', letterSpacing: '0.05em' }],  // 56px, 00:42:16

  // 힌트 정보
  'hint-label': ['1rem', { lineHeight: '1.5' }],      // 16px, "Hint"
  'hint-count': ['0.875rem', { lineHeight: '1.5' }],  // 14px, "12/999"

  // 섹션 제목
  'section-title': ['1.25rem', { lineHeight: '1.75rem' }], // 20px, "Hint Code"

  // 입력 필드
  'input-text': ['1.5rem', { lineHeight: '2rem' }],   // 24px, 입력값

  // 숫자 키패드
  'keypad-number': ['2rem', { lineHeight: '1' }],     // 32px, 1-9

  // 라벨
  'label-small': ['0.75rem', { lineHeight: '1rem' }], // 12px, "Start", "End"

  // 버튼
  'button-text': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }], // 14px, "MEMO"
}
```

**사용 예시:**
```html
<!-- 타이머 -->
<div class="text-timer-main font-bold text-text-primary">00:42:16</div>

<!-- 힌트 카운트 -->
<div class="text-hint-count text-text-secondary">12/999</div>

<!-- 섹션 제목 -->
<h2 class="text-section-title font-semibold text-text-primary">Hint Code</h2>

<!-- 키패드 숫자 -->
<button class="text-keypad-number font-medium text-text-primary">1</button>
```

### 2.2 폰트 두께 (Font Weight)

```javascript
fontWeight: {
  'light': 300,      // 보조 텍스트
  'normal': 400,     // 기본 텍스트
  'medium': 500,     // 키패드 숫자
  'semibold': 600,   // 제목, 버튼
  'bold': 700,       // 타이머
  'extrabold': 800,  // 강조 필요 시
}
```

### 2.3 행간 (Line Height)

- 타이머: `leading-none` (1)
- 일반 텍스트: `leading-normal` (1.5)
- 제목: `leading-tight` (1.25)

---

## 3. 레이아웃 (Layout)

### 3.1 간격 시스템 (Spacing)

```javascript
// tailwind.config.js 확장
spacing: {
  '18': '4.5rem',   // 72px
  '22': '5.5rem',   // 88px
  '88': '22rem',    // 352px
  '104': '26rem',   // 416px
}
```

**주요 간격 규칙:**
```html
<!-- 화면 패딩 -->
<div class="px-6 py-8">  <!-- 좌우 24px, 상하 32px -->

<!-- 섹션 간 간격 -->
<div class="space-y-8">  <!-- 요소 간 32px -->

<!-- 원형 타이머와 입력 영역 간격 -->
<div class="mt-16">      <!-- 상단 64px -->

<!-- 입력 박스 간격 -->
<div class="gap-3">      <!-- 12px -->

<!-- 키패드 행 간격 -->
<div class="gap-y-6">    <!-- 세로 24px -->
```

### 3.2 컨테이너 설정

```javascript
// tailwind.config.js
container: {
  center: true,
  padding: {
    DEFAULT: '1.5rem',  // 24px
    sm: '2rem',         // 32px
    lg: '4rem',         // 64px
  },
}
```

**전체 화면 컨테이너:**
```html
<div class="min-h-screen bg-gradient-to-b from-dark-gradient-start to-dark-gradient-end">
  <div class="container mx-auto px-6 py-8">
    <!-- 콘텐츠 -->
  </div>
</div>
```

### 3.3 그리드 시스템

```html
<!-- 힌트 코드 입력 박스 (4개) -->
<div class="grid grid-cols-4 gap-3 max-w-xs mx-auto">
  <div class="aspect-square"><!-- 입력 박스 --></div>
  <!-- 반복 -->
</div>

<!-- 숫자 키패드 (3x3 그리드) -->
<div class="grid grid-cols-3 gap-x-12 gap-y-6 max-w-sm mx-auto">
  <button class="aspect-square">1</button>
  <!-- 2-9 반복 -->
</div>
```

---

## 4. 컴포넌트 스타일 (Component Styles)

### 4.1 버튼 스타일

#### MEMO 버튼 (우측 상단)
```html
<button class="
  absolute top-6 right-6
  px-5 py-2
  bg-bg-button
  text-dark-primary
  text-button-text
  font-semibold
  rounded-full
  shadow-md
  hover:bg-gray-100
  active:scale-95
  transition-all duration-200
">
  MEMO
</button>
```

**Tailwind Config 확장:**
```javascript
borderRadius: {
  'full': '9999px',   // 완전한 라운드
  '2xl': '1rem',      // 16px
  'xl': '0.75rem',    // 12px
}
```

#### 숫자 키패드 버튼
```html
<button class="
  w-16 h-16
  flex items-center justify-center
  text-keypad-number
  font-medium
  text-text-primary
  bg-transparent
  hover:bg-white/10
  active:bg-white/20
  rounded-lg
  transition-colors duration-150
">
  1
</button>
```

### 4.2 입력 필드 스타일

#### 힌트 코드 입력 박스
```html
<div class="
  w-14 h-14
  flex items-center justify-center
  text-input-text
  text-text-primary
  font-semibold
  bg-bg-input
  border-2 border-border-light
  rounded-xl
  focus-within:border-border-focus
  focus-within:ring-2
  focus-within:ring-white/30
  transition-all duration-200
">
  <input
    type="text"
    maxlength="1"
    class="w-full h-full text-center bg-transparent outline-none"
  />
</div>
```

**포커스 상태:**
```javascript
// tailwind.config.js
extend: {
  ringColor: {
    'focus': 'rgba(255, 255, 255, 0.3)',
  },
  ringWidth: {
    'focus': '2px',
  },
}
```

### 4.3 원형 타이머/프로그레스 바

#### SVG 기반 원형 타이머
```html
<div class="relative w-64 h-64 mx-auto">
  <!-- 배경 원 -->
  <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
    <!-- 배경 트랙 -->
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="none"
      stroke="#2d2d2d"
      stroke-width="2"
    />
    <!-- 프로그레스 -->
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="none"
      stroke="#ffffff"
      stroke-width="3"
      stroke-linecap="round"
      stroke-dasharray="283"
      stroke-dashoffset="70"
      class="transition-all duration-300 ease-linear"
    />
  </svg>

  <!-- 중앙 콘텐츠 -->
  <div class="absolute inset-0 flex flex-col items-center justify-center">
    <div class="text-timer-main font-bold text-text-primary tracking-wider">
      00:42:16
    </div>
    <div class="mt-3 text-hint-label text-text-secondary">
      Hint
    </div>
    <div class="text-hint-count text-text-tertiary">
      12/999
    </div>
  </div>

  <!-- Start/End 라벨 -->
  <div class="absolute bottom-2 left-0 right-0 flex justify-between px-6">
    <span class="text-label-small text-text-tertiary">Start</span>
    <span class="text-label-small text-text-tertiary">End</span>
  </div>
</div>
```

**프로그레스 계산 (JavaScript):**
```javascript
// stroke-dashoffset 계산
const circumference = 2 * Math.PI * 45; // 283
const progress = (elapsedTime / totalTime) * 100;
const offset = circumference - (progress / 100) * circumference;
```

### 4.4 숫자 키패드

```html
<div class="mt-8">
  <h2 class="text-section-title font-semibold text-text-primary text-center mb-6">
    Hint Code
  </h2>

  <!-- 입력 박스 -->
  <div class="grid grid-cols-4 gap-3 max-w-xs mx-auto mb-12">
    <!-- 4개 입력 박스 반복 -->
  </div>

  <!-- 키패드 -->
  <div class="grid grid-cols-3 gap-x-12 gap-y-6 max-w-sm mx-auto">
    <button class="keypad-button">1</button>
    <button class="keypad-button">2</button>
    <button class="keypad-button">3</button>
    <button class="keypad-button">4</button>
    <button class="keypad-button">5</button>
    <button class="keypad-button">6</button>
    <button class="keypad-button">7</button>
    <button class="keypad-button">8</button>
    <button class="keypad-button">9</button>
  </div>
</div>
```

**키패드 버튼 재사용 클래스:**
```css
@layer components {
  .keypad-button {
    @apply w-16 h-16
           flex items-center justify-center
           text-keypad-number font-medium text-text-primary
           bg-transparent
           hover:bg-white/10
           active:bg-white/20
           rounded-lg
           transition-colors duration-150;
  }
}
```

---

## 5. 반응형 디자인 원칙

### 5.1 Breakpoint 전략

```javascript
// tailwind.config.js
screens: {
  'xs': '360px',   // 최소 지원 화면
  'sm': '640px',   // 모바일 (세로)
  'md': '768px',   // 태블릿
  'lg': '1024px',  // 데스크톱
  'xl': '1280px',  // 대형 화면
}
```

### 5.2 모바일 우선 설계

**기본 (모바일):**
```html
<div class="px-6 py-8">
```

**태블릿 이상:**
```html
<div class="px-6 py-8 md:px-12 md:py-16">
```

**데스크톱:**
```html
<div class="px-6 py-8 md:px-12 lg:px-24 lg:max-w-4xl lg:mx-auto">
```

### 5.3 컴포넌트별 반응형 규칙

#### 원형 타이머
```html
<!-- 모바일: w-64, 태블릿: w-80, 데스크톱: w-96 -->
<div class="w-64 md:w-80 lg:w-96 h-auto mx-auto">
```

#### 입력 박스
```html
<!-- 모바일: w-14, 데스크톱: w-16 -->
<div class="w-14 h-14 md:w-16 md:h-16">
```

#### 키패드
```html
<!-- 모바일: gap-x-12, 데스크톱: gap-x-16 -->
<div class="grid grid-cols-3 gap-x-12 gap-y-6 md:gap-x-16 md:gap-y-8">
```

---

## 6. Tailwind 설정 예시 (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 다크모드 지원
  theme: {
    extend: {
      colors: {
        // 다크 배경
        'dark-primary': '#1a1a1a',
        'dark-secondary': '#2d2d2d',
        'dark-gradient-start': '#1a1a1a',
        'dark-gradient-end': '#0a0a0a',

        // 악센트
        'accent-white': '#ffffff',
        'accent-light': '#f5f5f5',

        // 텍스트
        'text-primary': '#ffffff',
        'text-secondary': '#e5e5e5',
        'text-tertiary': '#a0a0a0',
        'text-muted': '#6b7280',

        // 테두리
        'border-light': '#404040',
        'border-accent': '#ffffff',
        'border-focus': '#ffffff',

        // 배경
        'bg-dark': '#1a1a1a',
        'bg-overlay': 'rgba(0, 0, 0, 0.5)',
        'bg-button': '#ffffff',
        'bg-input': 'transparent',
      },
      fontSize: {
        'timer-main': ['3.5rem', { lineHeight: '1', letterSpacing: '0.05em' }],
        'hint-label': ['1rem', { lineHeight: '1.5' }],
        'hint-count': ['0.875rem', { lineHeight: '1.5' }],
        'section-title': ['1.25rem', { lineHeight: '1.75rem' }],
        'input-text': ['1.5rem', { lineHeight: '2rem' }],
        'keypad-number': ['2rem', { lineHeight: '1' }],
        'label-small': ['0.75rem', { lineHeight: '1rem' }],
        'button-text': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '104': '26rem',
      },
      borderRadius: {
        '2xl': '1rem',
        'xl': '0.75rem',
      },
      ringColor: {
        'focus': 'rgba(255, 255, 255, 0.3)',
      },
      ringWidth: {
        'focus': '2px',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 255, 255, 0.1)',
        'inner-glow': 'inset 0 0 10px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '4rem',
      },
    },
    screens: {
      'xs': '360px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

---

## 7. 유틸리티 클래스 (Utility Classes)

### 7.1 재사용 가능한 컴포넌트 클래스

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  /* 버튼 */
  .btn-primary {
    @apply px-5 py-2 bg-bg-button text-dark-primary text-button-text font-semibold rounded-full shadow-md hover:bg-gray-100 active:scale-95 transition-all duration-200;
  }

  .btn-keypad {
    @apply w-16 h-16 flex items-center justify-center text-keypad-number font-medium text-text-primary bg-transparent hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors duration-150;
  }

  /* 입력 */
  .input-code-box {
    @apply w-14 h-14 flex items-center justify-center text-input-text text-text-primary font-semibold bg-bg-input border-2 border-border-light rounded-xl focus-within:border-border-focus focus-within:ring-2 focus-within:ring-white/30 transition-all duration-200;
  }

  /* 레이아웃 */
  .screen-container {
    @apply min-h-screen bg-gradient-to-b from-dark-gradient-start to-dark-gradient-end;
  }

  .content-wrapper {
    @apply container mx-auto px-6 py-8;
  }

  /* 텍스트 */
  .text-timer {
    @apply text-timer-main font-bold text-text-primary tracking-wider;
  }

  .text-section-heading {
    @apply text-section-title font-semibold text-text-primary text-center;
  }
}

@layer utilities {
  /* 사용자 정의 유틸리티 */
  .text-glow {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  .backdrop-blur-dark {
    backdrop-filter: blur(10px);
    background-color: rgba(0, 0, 0, 0.5);
  }
}
```

### 7.2 애니메이션 클래스

```css
@layer utilities {
  /* 페이드 인 */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* 스케일 펄스 */
  .scale-pulse {
    animation: scalePulse 2s infinite;
  }

  @keyframes scalePulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
}
```

---

## 8. 접근성 (Accessibility) 가이드

### 8.1 색상 대비 (WCAG AA 기준)

- **타이머 (흰색 on 어두운 배경)**: 대비율 21:1 ✅
- **힌트 카운트 (회색 on 어두운 배경)**: 대비율 7.5:1 ✅
- **MEMO 버튼 (검은색 on 흰색)**: 대비율 21:1 ✅

### 8.2 터치 타겟 크기

- **최소 터치 영역**: 44x44px (WCAG 권장)
- **키패드 버튼**: 64x64px ✅
- **입력 박스**: 56x56px ✅
- **MEMO 버튼**: 높이 40px, 패딩 포함 충분 ✅

### 8.3 포커스 인디케이터

```html
<!-- 키보드 포커스 가시성 -->
<button class="
  focus:outline-none
  focus:ring-2
  focus:ring-white/50
  focus:ring-offset-2
  focus:ring-offset-dark-primary
">
```

---

## 9. 다크모드 구현 (Dark Mode)

### 9.1 기본 다크모드 설정

이 앱은 **다크모드가 기본**이며, 라이트모드는 선택 사항입니다.

```html
<!-- HTML root에 dark 클래스 추가 -->
<html class="dark">
```

### 9.2 다크/라이트 전환 (선택 사항)

```javascript
// 다크모드 토글
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark');
};
```

```html
<!-- 조건부 스타일 -->
<div class="
  bg-dark-primary dark:bg-dark-primary
  text-text-primary dark:text-text-primary
">
```

---

## 10. 실제 사용 예시 (Full Page Component)

```tsx
// src/pages/GameScreen.tsx
import React from 'react';

export const GameScreen: React.FC = () => {
  return (
    <div className="screen-container">
      <div className="content-wrapper">
        {/* MEMO 버튼 */}
        <button className="btn-primary absolute top-6 right-6">
          MEMO
        </button>

        {/* 원형 타이머 */}
        <div className="mt-8">
          <div className="relative w-64 h-64 mx-auto">
            {/* SVG 프로그레스 */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#2d2d2d"
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset="70"
                className="transition-all duration-300"
              />
            </svg>

            {/* 중앙 콘텐츠 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-timer">00:42:16</div>
              <div className="mt-3 text-hint-label text-text-secondary">Hint</div>
              <div className="text-hint-count text-text-tertiary">12/999</div>
            </div>

            {/* Start/End 라벨 */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-between px-6">
              <span className="text-label-small text-text-tertiary">Start</span>
              <span className="text-label-small text-text-tertiary">End</span>
            </div>
          </div>
        </div>

        {/* 힌트 코드 입력 */}
        <div className="mt-16">
          <h2 className="text-section-heading mb-6">Hint Code</h2>

          {/* 입력 박스 */}
          <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="input-code-box">
                <input
                  type="text"
                  maxLength={1}
                  className="w-full h-full text-center bg-transparent outline-none"
                />
              </div>
            ))}
          </div>

          {/* 숫자 키패드 */}
          <div className="grid grid-cols-3 gap-x-12 gap-y-6 max-w-sm mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button key={num} className="btn-keypad">
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 11. 디자인 토큰 (Design Tokens)

```json
{
  "color": {
    "background": {
      "primary": "#1a1a1a",
      "secondary": "#2d2d2d",
      "gradient": {
        "start": "#1a1a1a",
        "end": "#0a0a0a"
      }
    },
    "text": {
      "primary": "#ffffff",
      "secondary": "#e5e5e5",
      "tertiary": "#a0a0a0",
      "muted": "#6b7280"
    },
    "border": {
      "default": "#404040",
      "accent": "#ffffff",
      "focus": "#ffffff"
    }
  },
  "typography": {
    "fontSize": {
      "timer": "3.5rem",
      "keypad": "2rem",
      "input": "1.5rem",
      "title": "1.25rem",
      "body": "1rem",
      "caption": "0.875rem",
      "label": "0.75rem"
    },
    "fontWeight": {
      "light": 300,
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeight": {
      "tight": 1,
      "normal": 1.5,
      "relaxed": 1.75
    }
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "0.75rem",
    "lg": "1rem",
    "xl": "1.5rem",
    "2xl": "2rem",
    "3xl": "3rem",
    "4xl": "4rem"
  },
  "borderRadius": {
    "sm": "0.375rem",
    "md": "0.5rem",
    "lg": "0.75rem",
    "xl": "1rem",
    "full": "9999px"
  }
}
```

---

## 12. 성능 최적화 팁

### 12.1 Tailwind CSS 최적화

```javascript
// tailwind.config.js
module.exports = {
  // 프로덕션 빌드 시 미사용 클래스 제거
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // JIT 모드 활성화 (기본값)
  mode: 'jit',
}
```

### 12.2 CSS 번들 크기 줄이기

```bash
# 프로덕션 빌드
npm run build

# Tailwind CSS는 자동으로 PurgeCSS를 통해
# 사용하지 않는 스타일을 제거합니다.
```

### 12.3 폰트 최적화

```html
<!-- Google Fonts Preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- 필요한 웨이트만 로드 -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 13. 체크리스트

### 13.1 디자인 구현 체크리스트

- [ ] 색상 시스템 적용 (다크 배경, 흰색 텍스트)
- [ ] 타이포그래피 일관성 유지 (폰트 크기, 두께)
- [ ] 간격 시스템 적용 (패딩, 마진, 갭)
- [ ] 원형 프로그레스 바 구현 (SVG)
- [ ] 입력 박스 스타일 (4개 그리드)
- [ ] 숫자 키패드 (3x3 그리드)
- [ ] MEMO 버튼 (우측 상단 플로팅)
- [ ] 반응형 디자인 (모바일 우선)
- [ ] 접근성 검증 (대비율, 터치 크기)
- [ ] 애니메이션 효과 (hover, active, transition)
- [ ] 다크모드 기본 설정
- [ ] 성능 최적화 (PurgeCSS)

### 13.2 품질 검증 체크리스트

- [ ] **색상 대비**: WCAG AA 기준 충족 (4.5:1 이상)
- [ ] **터치 타겟**: 최소 44x44px
- [ ] **폰트 크기**: 본문 최소 16px (모바일)
- [ ] **로딩 속도**: 초기 CSS 로드 < 100KB
- [ ] **브라우저 호환성**: Chrome 90+, Safari 14+
- [ ] **반응형**: 360px ~ 1920px 모든 화면 크기 지원

---

## 14. 참고 자료

- **Tailwind CSS 공식 문서**: https://tailwindcss.com/docs
- **WCAG 접근성 가이드라인**: https://www.w3.org/WAI/WCAG21/quickref/
- **Material Design 색상 대비 도구**: https://material.io/resources/color/
- **Tailwind CSS Playground**: https://play.tailwindcss.com/

---

## 문서 승인

**작성자**: UI Designer
**승인일**: 2025-11-27
**문서 상태**: 최종 승인 완료

이 스타일 가이드는 EscapeHint 모바일 앱의 공식 디자인 시스템입니다. 모든 UI 구현은 이 문서를 기준으로 진행됩니다.
