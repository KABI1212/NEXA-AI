# NEXA AI — Frontend Architecture & UI/UX Design (FAD)
## Enterprise AI-Based Career Guidance and Learning Platform

---

| Field              | Details                                                 |
|--------------------|---------------------------------------------------------|
| **Document**       | Frontend Architecture & UI/UX Design (FAD)            |
| **Phase**          | 8 of 30                                                 |
| **Version**        | 1.0                                                     |
| **Framework**      | React 19 + TypeScript 5                                 |
| **Build Tool**     | Vite 6                                                  |
| **Styling**        | Tailwind CSS 4 + shadcn/ui                              |
| **Animation**      | Framer Motion 12                                        |
| **State**          | Redux Toolkit 2 + TanStack Query 5                      |
| **Architecture**   | Feature-Based + Component-Based                         |
| **Date**           | July 2026                                               |
| **Status**         | ✅ Complete                                             |

---

## Table of Contents

1. [Frontend Overview](#1-frontend-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Folder Structure](#3-folder-structure)
4. [Project Configuration](#4-project-configuration)
5. [Design System](#5-design-system)
6. [Theme System](#6-theme-system)
7. [Typography & Spacing](#7-typography--spacing)
8. [Component Library](#8-component-library)
9. [Layout System](#9-layout-system)
10. [Routing & Navigation](#10-routing--navigation)
11. [State Management](#11-state-management)
12. [API Layer](#12-api-layer)
13. [Custom Hooks](#13-custom-hooks)
14. [Page Specifications](#14-page-specifications)
15. [AI Chat Interface](#15-ai-chat-interface)
16. [Student Dashboard](#16-student-dashboard)
17. [Mentor Dashboard](#17-mentor-dashboard)
18. [Admin Dashboard](#18-admin-dashboard)
19. [Career Guidance Page](#19-career-guidance-page)
20. [Resume Module](#20-resume-module)
21. [Learning Management System](#21-learning-management-system)
22. [Interview Coach](#22-interview-coach)
23. [Coding Platform](#23-coding-platform)
24. [Analytics Dashboard](#24-analytics-dashboard)
25. [Form Standards](#25-form-standards)
26. [Loading & Error States](#26-loading--error-states)
27. [Accessibility Standards](#27-accessibility-standards)
28. [Performance Strategy](#28-performance-strategy)
29. [Frontend Security](#29-frontend-security)
30. [Implementation Standards](#30-implementation-standards)

---

## 1. Frontend Overview

NEXA AI's frontend is designed as a **modern SaaS AI platform** — not a college dashboard. Every screen should feel commercial-grade.

**Design Inspirations:**
| Platform        | What We Borrow                               |
|-----------------|----------------------------------------------|
| ChatGPT         | 3-panel chat layout, history sidebar         |
| Notion          | Clean sidebar, collapsible navigation        |
| Coursera        | Course card layout, progress tracking        |
| Linear          | Dark-first design, minimal chrome            |
| Vercel Dashboard| Stats cards, deployment-style status items  |

**Differentiation:** All design is original — inspired by these but built from scratch.

---

## 2. Architecture Diagram

```
Browser
  │
  ▼
React 19 App (Vite)
  │
  ├── App.tsx (Providers + Router)
  │     │
  │     ├── QueryClientProvider (TanStack Query)
  │     ├── ReduxProvider (Redux Toolkit)
  │     ├── ThemeProvider (dark/light)
  │     └── ToasterProvider (react-hot-toast)
  │
  ├── Routes (React Router v7)
  │     ├── Public Routes   → /login, /register
  │     └── Protected Routes → /dashboard, /chat, /career, ...
  │
  ├── Layouts
  │     ├── AppLayout       → Sidebar + TopNav + Main content
  │     ├── AuthLayout      → Centered card (login/register)
  │     └── AdminLayout     → Admin-specific chrome
  │
  ├── Pages (lazy loaded per route)
  │
  ├── Features (co-located logic)
  │     ├── auth/
  │     ├── chat/
  │     ├── career/
  │     ├── resume/
  │     ├── courses/
  │     └── ...
  │
  ├── Components (shared atomic UI)
  │
  ├── Store (Redux slices)
  │
  ├── Services (Axios API layer)
  │     └── Axios instance with JWT interceptor + auto-refresh
  │
  └── Hooks (shared custom hooks)
```

---

## 3. Folder Structure

```
frontend/
│
├── public/
│   └── favicon.svg
│
├── src/
│   │
│   ├── app/
│   │   ├── App.tsx                   # Root component — all providers
│   │   ├── router.tsx                # Route definitions (lazy loaded)
│   │   └── providers.tsx             # QueryClient, Redux, Theme, Toast
│   │
│   ├── pages/                        # One file per route (thin shells)
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── chat/
│   │   │   └── AIChatPage.tsx
│   │   ├── career/
│   │   │   ├── CareerPage.tsx
│   │   │   └── SkillGapPage.tsx
│   │   ├── courses/
│   │   │   ├── CourseListPage.tsx
│   │   │   ├── CourseDetailPage.tsx
│   │   │   └── LessonPage.tsx
│   │   ├── resume/
│   │   │   ├── ResumeHubPage.tsx
│   │   │   ├── ResumeAnalysisPage.tsx
│   │   │   └── ResumeBuilderPage.tsx
│   │   ├── interview/
│   │   │   ├── InterviewListPage.tsx
│   │   │   └── MockInterviewPage.tsx
│   │   ├── coding/
│   │   │   └── CodingAssistantPage.tsx
│   │   ├── roadmap/
│   │   │   └── RoadmapPage.tsx
│   │   ├── analytics/
│   │   │   └── AnalyticsPage.tsx
│   │   ├── profile/
│   │   │   └── ProfilePage.tsx
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx
│   │   ├── notifications/
│   │   │   └── NotificationsPage.tsx
│   │   ├── jobs/
│   │   │   └── JobsPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboardPage.tsx
│   │       ├── UserManagementPage.tsx
│   │       ├── CourseManagementPage.tsx
│   │       └── AIConfigPage.tsx
│   │
│   ├── features/                     # Co-located feature logic
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── OAuthButtons.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useLoginForm.ts
│   │   │   └── api.ts
│   │   ├── chat/
│   │   │   ├── components/
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── TypingIndicator.tsx
│   │   │   │   ├── ChatSidebar.tsx
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   └── ContextPanel.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAIChat.ts
│   │   │   └── api.ts
│   │   ├── career/
│   │   │   ├── components/
│   │   │   │   ├── CareerMatchCard.tsx
│   │   │   │   ├── SkillGapChart.tsx
│   │   │   │   └── RoadmapTimeline.tsx
│   │   │   └── api.ts
│   │   ├── resume/
│   │   │   ├── components/
│   │   │   │   ├── ResumeUploader.tsx
│   │   │   │   ├── ATSScoreCard.tsx
│   │   │   │   ├── SuggestionsList.tsx
│   │   │   │   └── ResumePreview.tsx
│   │   │   └── api.ts
│   │   ├── courses/
│   │   │   ├── components/
│   │   │   │   ├── CourseCard.tsx
│   │   │   │   ├── VideoPlayer.tsx
│   │   │   │   ├── LessonList.tsx
│   │   │   │   ├── QuizWidget.tsx
│   │   │   │   └── ProgressRing.tsx
│   │   │   └── api.ts
│   │   ├── interview/
│   │   │   ├── components/
│   │   │   │   ├── InterviewSetup.tsx
│   │   │   │   ├── QuestionPanel.tsx
│   │   │   │   ├── InterviewTimer.tsx
│   │   │   │   └── ScoreReport.tsx
│   │   │   └── api.ts
│   │   ├── coding/
│   │   │   ├── components/
│   │   │   │   ├── CodeEditor.tsx
│   │   │   │   ├── LanguageSelector.tsx
│   │   │   │   ├── AIExplanationPanel.tsx
│   │   │   │   └── TestCaseRunner.tsx
│   │   │   └── api.ts
│   │   └── analytics/
│   │       ├── components/
│   │       │   ├── LearningHoursChart.tsx
│   │       │   ├── SkillGrowthRadar.tsx
│   │       │   ├── ReadinessGauge.tsx
│   │       │   └── StatCard.tsx
│   │       └── api.ts
│   │
│   ├── components/                   # Shared atomic components
│   │   ├── ui/                       # Base design system components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Drawer.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Accordion.tsx
│   │   │   ├── Progress.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Toast.tsx
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopNav.tsx
│   │   │   └── MobileNav.tsx
│   │   └── shared/
│   │       ├── ProtectedRoute.tsx
│   │       ├── SkeletonCard.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── Breadcrumb.tsx
│   │       └── Pagination.tsx
│   │
│   ├── store/                        # Redux Toolkit
│   │   ├── index.ts                  # configureStore
│   │   ├── authSlice.ts
│   │   ├── notificationSlice.ts
│   │   └── themeSlice.ts
│   │
│   ├── services/                     # Axios API modules
│   │   ├── api.ts                    # Axios instance + interceptors
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── careerService.ts
│   │   ├── resumeService.ts
│   │   ├── courseService.ts
│   │   ├── chatService.ts
│   │   ├── interviewService.ts
│   │   ├── analyticsService.ts
│   │   └── adminService.ts
│   │
│   ├── hooks/                        # Shared custom hooks
│   │   ├── useAuth.ts
│   │   ├── useAIChat.ts
│   │   ├── useTheme.ts
│   │   ├── useNotifications.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── types/                        # TypeScript interfaces
│   │   ├── api.types.ts
│   │   ├── user.types.ts
│   │   ├── chat.types.ts
│   │   ├── course.types.ts
│   │   ├── resume.types.ts
│   │   └── analytics.types.ts
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   ├── styles/
│   │   └── globals.css               # Tailwind base + CSS variables
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Project Configuration

### 4.1 `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:  ['react', 'react-dom', 'react-router-dom'],
          ui:      ['framer-motion', 'lucide-react'],
          charts:  ['chart.js', 'react-chartjs-2'],
          editor:  ['@monaco-editor/react'],
          query:   ['@tanstack/react-query'],
          redux:   ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
})
```

### 4.2 `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        purple: {
          500: '#7c3aed',
          600: '#6d28d9',
        },
        surface: {
          DEFAULT: '#1e293b',
          raised:  '#263348',
          overlay: '#2d3e55',
        },
        bg: {
          DEFAULT: '#0f172a',
          secondary: '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-in-out',
        'slide-up':    'slideUp 0.3s ease-out',
        'slide-right': 'slideRight 0.2s ease-out',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:     { from: { opacity: '0' },                                        to: { opacity: '1' } },
        slideUp:    { from: { transform: 'translateY(12px)', opacity: '0' },        to: { transform: 'translateY(0)', opacity: '1' } },
        slideRight: { from: { transform: 'translateX(-12px)', opacity: '0' },       to: { transform: 'translateX(0)', opacity: '1' } },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

---

## 5. Design System

### 5.1 Color Palette

| Token              | Dark Mode           | Light Mode     | Purpose                       |
|--------------------|---------------------|----------------|-------------------------------|
| `--bg-primary`     | `#0F172A`           | `#F8FAFC`      | Page background               |
| `--bg-secondary`   | `#1E293B`           | `#F1F5F9`      | Sidebar, cards                |
| `--surface`        | `#263348`           | `#FFFFFF`      | Elevated cards                |
| `--surface-raised` | `#2D3E55`           | `#F8FAFC`      | Hover states, raised elements |
| `--border`         | `#334155`           | `#E2E8F0`      | Dividers, input borders       |
| `--text-primary`   | `#F8FAFC`           | `#0F172A`      | Headlines                     |
| `--text-secondary` | `#94A3B8`           | `#64748B`      | Descriptions, labels          |
| `--text-muted`     | `#64748B`           | `#94A3B8`      | Placeholders, timestamps      |
| `--brand-primary`  | `#2563EB`           | `#2563EB`      | CTAs, active states           |
| `--brand-purple`   | `#7C3AED`           | `#7C3AED`      | AI features, secondary CTA    |
| `--brand-amber`    | `#F59E0B`           | `#F59E0B`      | Warnings, highlights          |
| `--success`        | `#10B981`           | `#059669`      | Success states                |
| `--danger`         | `#EF4444`           | `#DC2626`      | Errors, destructive actions   |
| `--ai-gradient`    | `#2563EB → #7C3AED` | Same           | AI feature accents            |

### 5.2 Shadow Tokens

```css
--shadow-sm:   0 1px 2px rgba(0,0,0,0.3);
--shadow-md:   0 4px 12px rgba(0,0,0,0.35);
--shadow-lg:   0 8px 24px rgba(0,0,0,0.4);
--shadow-glow: 0 0 20px rgba(37,99,235,0.25);
--shadow-ai:   0 0 30px rgba(124,58,237,0.2);
```

---

## 6. Theme System

### 6.1 `src/styles/globals.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── CSS Variables: Dark Mode (default) ────────────── */
:root {
  --bg-primary:     #0F172A;
  --bg-secondary:   #1E293B;
  --surface:        #263348;
  --surface-raised: #2D3E55;
  --border:         #334155;
  --text-primary:   #F8FAFC;
  --text-secondary: #94A3B8;
  --text-muted:     #64748B;
  --brand-primary:  #2563EB;
  --brand-purple:   #7C3AED;
  --brand-amber:    #F59E0B;
  --success:        #10B981;
  --danger:         #EF4444;
  --radius:         0.5rem;
}

/* ── CSS Variables: Light Mode ──────────────────────── */
.light {
  --bg-primary:     #F8FAFC;
  --bg-secondary:   #F1F5F9;
  --surface:        #FFFFFF;
  --surface-raised: #F8FAFC;
  --border:         #E2E8F0;
  --text-primary:   #0F172A;
  --text-secondary: #64748B;
  --text-muted:     #94A3B8;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', 'Roboto', 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar        { width: 6px; }
::-webkit-scrollbar-track  { background: var(--bg-secondary); }
::-webkit-scrollbar-thumb  { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

.gradient-text {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.08);
}
```

### 6.2 Theme Redux Slice

```typescript
// src/store/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Theme = 'dark' | 'light' | 'system'
interface ThemeState { theme: Theme; resolved: 'dark' | 'light' }

const getSystemTheme = (): 'dark' | 'light' =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const initialState: ThemeState = {
  theme:    (localStorage.getItem('theme') as Theme) ?? 'dark',
  resolved: 'dark',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
      state.resolved = action.payload === 'system' ? getSystemTheme() : action.payload
      localStorage.setItem('theme', action.payload)
      document.documentElement.className = state.resolved
    },
  },
})

export const { setTheme } = themeSlice.actions
export default themeSlice.reducer
```

---

## 7. Typography & Spacing

### 7.1 Type Scale

| Token       | Size  | Weight | Usage                     |
|-------------|-------|--------|---------------------------|
| `text-xs`   | 12px  | 400    | Timestamps, captions      |
| `text-sm`   | 14px  | 400    | Body text, labels         |
| `text-base` | 16px  | 400    | Default body text         |
| `text-lg`   | 18px  | 500    | Card titles               |
| `text-xl`   | 20px  | 600    | Section headings          |
| `text-2xl`  | 24px  | 700    | Page titles               |
| `text-3xl`  | 30px  | 700    | Dashboard headlines       |
| `text-4xl`  | 36px  | 800    | Hero text                 |

### 7.2 Spacing Scale

```
4px  → gap-1    tight grouping
8px  → gap-2    inline elements
12px → gap-3    form fields
16px → gap-4    card padding
24px → gap-6    section spacing
32px → gap-8    large sections
48px → gap-12   page sections
64px → gap-16   hero spacing
```

---

## 8. Component Library

### 8.1 Button Component

```typescript
// src/components/ui/Button.tsx
import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:   'bg-brand-500 text-white hover:bg-brand-600 shadow-md active:scale-[0.98]',
        secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-raised',
        ghost:     'text-text-secondary hover:text-text-primary hover:bg-surface',
        danger:    'bg-danger text-white hover:bg-red-600',
        ai:        'bg-gradient-to-r from-brand-500 to-purple-500 text-white hover:opacity-90',
      },
      size: {
        sm:   'h-8  px-3 text-sm',
        md:   'h-10 px-4 text-sm',
        lg:   'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
export { Button, buttonVariants }
```

### 8.2 StatCard Component

```typescript
// src/components/shared/StatCard.tsx
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

interface StatCardProps {
  title:   string
  value:   string | number
  change?: string
  trend?:  'up' | 'down' | 'neutral'
  icon:    LucideIcon
  color?:  'blue' | 'purple' | 'green' | 'amber'
}

const colorMap = {
  blue:   'bg-blue-500/10 text-blue-400',
  purple: 'bg-purple-500/10 text-purple-400',
  green:  'bg-emerald-500/10 text-emerald-400',
  amber:  'bg-amber-500/10 text-amber-400',
}

export function StatCard({ title, value, change, trend, icon: Icon, color = 'blue' }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className="rounded-xl border border-border bg-surface p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="mt-2 text-3xl font-bold text-text-primary">{value}</p>
          {change && (
            <p className={cn('mt-1 text-sm', trend === 'up' ? 'text-emerald-400' : 'text-red-400')}>
              {trend === 'up' ? '▲' : '▼'} {change}
            </p>
          )}
        </div>
        <div className={cn('rounded-lg p-3', colorMap[color])}>
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  )
}
```

### 8.3 Skeleton Loader

```typescript
// src/components/shared/SkeletonCard.tsx
import { cn } from '@/utils/cn'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-surface-raised', className)} />
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  )
}
```

---

## 9. Layout System

### 9.1 `AppLayout.tsx`

```typescript
// src/components/layout/AppLayout.tsx
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col ml-64 transition-all duration-300">
        <TopNav />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

### 9.2 Sidebar Navigation

```typescript
// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, MessageSquare, Compass, BookOpen,
  FileText, Video, Code2, Map, BarChart3, Bell,
  User, Settings, LogOut, Zap, Briefcase,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard'        },
  { to: '/chat',      icon: MessageSquare,   label: 'AI Chat',  ai: true },
  { to: '/career',    icon: Compass,         label: 'Career'           },
  { to: '/courses',   icon: BookOpen,        label: 'Courses'          },
  { to: '/resume',    icon: FileText,        label: 'Resume'           },
  { to: '/interview', icon: Video,           label: 'Interview'        },
  { to: '/coding',    icon: Code2,           label: 'Coding'           },
  { to: '/roadmap',   icon: Map,             label: 'Roadmap'          },
  { to: '/jobs',      icon: Briefcase,       label: 'Jobs'             },
  { to: '/analytics', icon: BarChart3,       label: 'Analytics'        },
]

export function Sidebar() {
  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-bg-secondary flex flex-col z-30"
      initial={{ x: -264 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-500">
          <Zap size={16} className="text-white" />
        </div>
        <span className="text-lg font-bold gradient-text">NEXA AI</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150
               ${isActive
                 ? 'bg-brand-500/10 text-brand-500 border border-brand-500/20'
                 : 'text-text-secondary hover:text-text-primary hover:bg-surface'}`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
            {item.ai && (
              <span className="ml-auto rounded-full bg-purple-500/20 px-1.5 py-0.5 text-xs text-purple-400 font-medium">
                AI
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-3 space-y-1">
        {[
          { to: '/notifications', icon: Bell,     label: 'Notifications' },
          { to: '/profile',       icon: User,     label: 'Profile'       },
          { to: '/settings',      icon: Settings, label: 'Settings'      },
        ].map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </motion.aside>
  )
}
```

---

## 10. Routing & Navigation

### 10.1 Router with Lazy Loading

```typescript
// src/app/router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppLayout }    from '@/components/layout/AppLayout'
import { AuthLayout }   from '@/components/layout/AuthLayout'
import { AdminLayout }  from '@/components/layout/AdminLayout'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { PageLoader }   from '@/components/shared/PageLoader'

const lazy_ = (fn: () => Promise<{ default: React.ComponentType }>) =>
  lazy(fn)

const LoginPage          = lazy_(() => import('@/pages/auth/LoginPage'))
const RegisterPage       = lazy_(() => import('@/pages/auth/RegisterPage'))
const DashboardPage      = lazy_(() => import('@/pages/dashboard/DashboardPage'))
const AIChatPage         = lazy_(() => import('@/pages/chat/AIChatPage'))
const CareerPage         = lazy_(() => import('@/pages/career/CareerPage'))
const CoursesPage        = lazy_(() => import('@/pages/courses/CourseListPage'))
const CourseDetailPage   = lazy_(() => import('@/pages/courses/CourseDetailPage'))
const LessonPage         = lazy_(() => import('@/pages/courses/LessonPage'))
const ResumeHubPage      = lazy_(() => import('@/pages/resume/ResumeHubPage'))
const MockInterviewPage  = lazy_(() => import('@/pages/interview/MockInterviewPage'))
const CodingPage         = lazy_(() => import('@/pages/coding/CodingAssistantPage'))
const RoadmapPage        = lazy_(() => import('@/pages/roadmap/RoadmapPage'))
const AnalyticsPage      = lazy_(() => import('@/pages/analytics/AnalyticsPage'))
const ProfilePage        = lazy_(() => import('@/pages/profile/ProfilePage'))
const SettingsPage       = lazy_(() => import('@/pages/settings/SettingsPage'))
const AdminDashboardPage = lazy_(() => import('@/pages/admin/AdminDashboardPage'))

const wrap = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}><Component /></Suspense>
)

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',    element: wrap(LoginPage) },
      { path: '/register', element: wrap(RegisterPage) },
    ],
  },
  {
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { path: '/dashboard',                      element: wrap(DashboardPage)     },
      { path: '/chat',                           element: wrap(AIChatPage)        },
      { path: '/career',                         element: wrap(CareerPage)        },
      { path: '/courses',                        element: wrap(CoursesPage)       },
      { path: '/courses/:courseId',              element: wrap(CourseDetailPage)  },
      { path: '/courses/:courseId/lessons/:id',  element: wrap(LessonPage)        },
      { path: '/resume',                         element: wrap(ResumeHubPage)     },
      { path: '/interview',                      element: wrap(MockInterviewPage) },
      { path: '/coding',                         element: wrap(CodingPage)        },
      { path: '/roadmap',                        element: wrap(RoadmapPage)       },
      { path: '/analytics',                      element: wrap(AnalyticsPage)     },
      { path: '/profile',                        element: wrap(ProfilePage)       },
      { path: '/settings',                       element: wrap(SettingsPage)      },
    ],
  },
  {
    element: <ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>,
    children: [
      { path: '/admin', element: wrap(AdminDashboardPage) },
    ],
  },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
])
```

### 10.2 Protected Route

```typescript
// src/components/shared/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store'

interface ProtectedRouteProps {
  children:      React.ReactNode
  requiredRole?: string
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAppSelector(s => s.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}
```

---

## 11. State Management

### 11.1 Redux Store

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authReducer         from './authSlice'
import notificationReducer from './notificationSlice'
import themeReducer        from './themeSlice'

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    notifications: notificationReducer,
    theme:         themeReducer,
  },
})

export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch              = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

### 11.2 Auth Slice

```typescript
// src/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User { id: string; email: string; role: 'student' | 'mentor' | 'admin' | 'super_admin' }

interface AuthState {
  user:            User | null
  accessToken:     string | null
  isAuthenticated: boolean
  isLoading:       boolean
}

const initialState: AuthState = {
  user:            null,
  accessToken:     localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading:       false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, { payload }: PayloadAction<{ user: User; accessToken: string }>) {
      state.user            = payload.user
      state.accessToken     = payload.accessToken
      state.isAuthenticated = true
      localStorage.setItem('access_token', payload.accessToken)
    },
    updateAccessToken(state, { payload }: PayloadAction<string>) {
      state.accessToken = payload
      localStorage.setItem('access_token', payload)
    },
    logout(state) {
      state.user            = null
      state.accessToken     = null
      state.isAuthenticated = false
      localStorage.removeItem('access_token')
    },
  },
})

export const { setCredentials, updateAccessToken, logout } = authSlice.actions
export default authSlice.reducer
```

### 11.3 TanStack Query Setup

```typescript
// src/app/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/store'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            5 * 60 * 1000,
      gcTime:               10 * 60 * 1000,
      retry:                2,
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--surface)',
              color:      'var(--text-primary)',
              border:     '1px solid var(--border)',
            },
          }}
        />
      </QueryClientProvider>
    </ReduxProvider>
  )
}
```

---

## 12. API Layer

### 12.1 Axios Instance with Auto Token Refresh

```typescript
// src/services/api.ts
import axios from 'axios'
import { store } from '@/store'
import { updateAccessToken, logout } from '@/store/authSlice'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

// Attach JWT on every request
api.interceptors.request.use(config => {
  const token = store.getState().auth.accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
let isRefreshing = false
let failedQueue: { resolve: (v: string) => void; reject: (e: unknown) => void }[] = []

api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
          .then(token => { original.headers.Authorization = `Bearer ${token}`; return api(original) })
      }
      original._retry = true
      isRefreshing = true
      try {
        const { data } = await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true })
        const newToken = data.data.access_token
        store.dispatch(updateAccessToken(newToken))
        failedQueue.forEach(p => p.resolve(newToken))
        failedQueue = []
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        failedQueue.forEach(p => p.reject(error))
        failedQueue = []
        store.dispatch(logout())
        window.location.href = '/login'
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default api
```

### 12.2 Service Modules

```typescript
// src/services/authService.ts
import api from './api'
export const authService = {
  login:    (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { email: string; password: string }) => api.post('/auth/register', data),
  logout:   () => api.post('/auth/logout'),
  me:       () => api.get('/users/me'),
}

// src/services/chatService.ts
import api from './api'
export const chatService = {
  send:       (sessionId: string, message: string) => api.post('/ai/chat', { session_id: sessionId, message }),
  sessions:   (page = 1)                           => api.get(`/ai/sessions?page=${page}`),
  session:    (id: string)                         => api.get(`/ai/sessions/${id}`),
  feedback:   (msgId: string, rating: string)      => api.post('/ai/feedback', { message_id: msgId, rating }),
}

// src/services/resumeService.ts
import api from './api'
export const resumeService = {
  list:     ()                  => api.get('/resume'),
  upload:   (file: File)        => { const fd = new FormData(); fd.append('file', file); return api.post('/resume/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }) },
  analyze:  (id: string)        => api.post(`/resume/${id}/analyze`),
  score:    (id: string)        => api.get(`/resume/${id}/score`),
  download: (id: string)        => api.get(`/resume/${id}/download`, { responseType: 'blob' }),
}

// src/services/courseService.ts
import api from './api'
export const courseService = {
  list:    (page = 1, filter = '') => api.get(`/courses?page=${page}&category=${filter}`),
  detail:  (id: string)            => api.get(`/courses/${id}`),
  enroll:  (id: string)            => api.post(`/courses/${id}/enroll`),
  progress:(courseId: string)      => api.get(`/learning/progress/${courseId}`),
}
```

---

## 13. Custom Hooks

### 13.1 `useAIChat` — WebSocket Chat

```typescript
// src/hooks/useAIChat.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppSelector } from '@/store'

export interface ChatMessage {
  id:          string
  role:        'user' | 'assistant'
  content:     string
  agentsUsed?: string[]
  latencyMs?:  number
  timestamp:   Date
}

export function useAIChat(sessionId: string) {
  const [messages,    setMessages]    = useState<ChatMessage[]>([])
  const [isTyping,    setIsTyping]    = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const ws    = useRef<WebSocket | null>(null)
  const token = useAppSelector(s => s.auth.accessToken)

  useEffect(() => {
    if (!token) return
    const socket = new WebSocket(`ws://localhost:8000/ws/chat?token=${token}`)
    ws.current = socket
    socket.onopen  = () => setIsConnected(true)
    socket.onclose = () => setIsConnected(false)
    socket.onmessage = event => {
      const data = JSON.parse(event.data)
      if (data.type === 'typing') { setIsTyping(data.status); return }
      if (data.type === 'response') {
        setIsTyping(false)
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(), role: 'assistant', content: data.content,
          agentsUsed: data.agents_used, latencyMs: data.latency_ms, timestamp: new Date(),
        }])
      }
    }
    return () => socket.close()
  }, [token])

  const sendMessage = useCallback((message: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(), role: 'user', content: message, timestamp: new Date(),
    }])
    ws.current.send(JSON.stringify({ message, session_id: sessionId }))
  }, [sessionId])

  return { messages, isTyping, isConnected, sendMessage }
}
```

### 13.2 `useAuth`

```typescript
// src/hooks/useAuth.ts
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { setCredentials, logout as logoutAction } from '@/store/authSlice'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'

export function useAuth() {
  const dispatch  = useAppDispatch()
  const navigate  = useNavigate()
  const auth      = useAppSelector(s => s.auth)

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await authService.login({ email, password })
    dispatch(setCredentials({ user: data.data, accessToken: data.data.access_token }))
    navigate('/dashboard')
    toast.success('Welcome back!')
  }, [dispatch, navigate])

  const logout = useCallback(async () => {
    await authService.logout().catch(() => {})
    dispatch(logoutAction())
    navigate('/login')
  }, [dispatch, navigate])

  return { ...auth, login, logout }
}
```

---

## 14. Page Specifications

| Page             | Key Components                                                         |
|------------------|------------------------------------------------------------------------|
| Login            | LoginForm, OAuthButtons, AnimatedBackground                           |
| Register         | RegisterForm, StepIndicator, OAuthButtons                             |
| Dashboard        | StatCards, RoadmapWidget, LearningProgress, AIInsight, RecentChats   |
| AI Chat          | ChatSidebar, ChatWindow, MessageBubble, TypingIndicator, ContextPanel |
| Career           | CareerMatchCard, SkillGapChart, SalaryBar, CompanyGrid                |
| Courses          | CourseGrid, FilterBar, CourseCard, SearchInput                        |
| Course Detail    | CourseHeader, LessonList, VideoPlayer, QuizWidget, ProgressRing       |
| Resume Hub       | ResumeUploader, ATSScoreCard, SuggestionsList, VersionHistory         |
| Interview        | InterviewSetup, QuestionPanel, InterviewTimer, ScoreReport            |
| Coding           | CodeEditor, LanguageSelector, AIExplanationPanel, TestCases           |
| Roadmap          | RoadmapTimeline, MonthCard, WeekAccordion, DailyTaskList              |
| Analytics        | LearningHoursChart, SkillRadar, ReadinessGauge, StatCard grid         |
| Admin            | UserTable, PlatformStats, AIHealthCard, AuditLogViewer                |

---

## 15. AI Chat Interface

### 15.1 Three-Panel Layout

```
┌───────────────┬─────────────────────────────────┬─────────────────┐
│  LEFT PANEL   │        CENTER PANEL             │  RIGHT PANEL    │
│  240px        │        flex-1                   │  300px          │
│               │                                 │                 │
│  + New Chat   │  ┌─────────────────────────┐    │  AI Memory      │
│               │  │ [User] message bubble   │    │  ─────────────  │
│  ─ Today ──── │  └─────────────────────────┘    │  Career: AI Eng │
│  Career paths │                                 │  Skills: Python │
│  Python tips  │  ┌─────────────────────────┐    │                 │
│  Docker help  │  │ [AI] response with      │    │  Related        │
│               │  │ markdown + code blocks  │    │  ─────────────  │
│  ─ Yesterday ─│  └─────────────────────────┘    │  📚 ML Course   │
│  Resume review│                                 │  🗺️ Roadmap     │
│               │  [typing indicator ...]         │  💼 Job Matches │
│               │                                 │                 │
│               │  ┌─────────────────────────┐    │  Quick Actions  │
│               │  │ Suggested Questions     │    │  ─────────────  │
│               │  │ > Career path in AI?    │    │  Analyze Resume │
│               │  │ > Resume tips?          │    │  View Roadmap   │
│               │  └─────────────────────────┘    │  Start Interview│
│               │                                 │                 │
│               │  [📎] [Ask anything...]  [▶]    │                 │
└───────────────┴─────────────────────────────────┴─────────────────┘
```

### 15.2 `MessageBubble.tsx`

```typescript
// src/features/chat/components/MessageBubble.tsx
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown, Copy } from 'lucide-react'
import { ChatMessage } from '@/hooks/useAIChat'

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold
        ${isUser ? 'bg-brand-500 text-white' : 'bg-gradient-to-br from-brand-500 to-purple-500 text-white'}`}>
        {isUser ? 'U' : 'N'}
      </div>

      <div className={`max-w-[75%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm
          ${isUser
            ? 'bg-brand-500 text-white rounded-tr-sm'
            : 'bg-surface border border-border text-text-primary rounded-tl-sm'}`}>
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter style={vscDarkPlus} language={match[1]} className="rounded-lg text-xs">
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="rounded bg-surface-raised px-1 py-0.5 font-mono text-xs">{children}</code>
                  )
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {!isUser && (
          <div className="flex items-center gap-2">
            <button className="p-1 text-text-muted hover:text-text-secondary"><ThumbsUp size={13} /></button>
            <button className="p-1 text-text-muted hover:text-text-secondary"><ThumbsDown size={13} /></button>
            <button className="p-1 text-text-muted hover:text-text-secondary"><Copy size={13} /></button>
            {message.latencyMs && (
              <span className="text-xs text-text-muted">{(message.latencyMs / 1000).toFixed(1)}s</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
```

### 15.3 Typing Indicator

```typescript
// src/features/chat/components/TypingIndicator.tsx
import { motion } from 'framer-motion'

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-purple-500">
        <span className="text-xs font-bold text-white">N</span>
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-3">
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-text-muted"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, delay, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  )
}
```

---

## 16. Student Dashboard

### Dashboard Widget Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Good morning, John! 🚀  Placement Readiness: 68%          │
├──────────┬──────────┬──────────┬─────────────────────────── │
│  Resume  │ Learning │Interview │  AI Recommendations         │
│  Score   │ Progress │  Score   │  "Complete Docker course"   │
│  72/100  │   45%    │  74/100  │  "Practice system design"   │
│  ▲ +8    │  3 done  │  ▲ +12   │                            │
├──────────┴──────────┴──────────┴─────────────────────────── │
│  Active Roadmap — AI Engineer          28% Complete         │
│  ████████░░░░░░░░░░░░░░  Month 2/6: ML Fundamentals        │
├─────────────────────────┬───────────────────────────────────┤
│  Courses In Progress    │  Today's Tasks                    │
│  Python for AI   65%    │  ✓ Complete NumPy lesson          │
│  React Advanced  30%    │  ○ Practice LeetCode problems     │
│  System Design   10%    │  ○ Update resume with projects    │
├─────────────────────────┼───────────────────────────────────┤
│  Recent AI Chats        │  Skill Growth (30 days)           │
│  "Career path in AI..."  │  Python ████████ 78%            │
│  "Resume review tips..."│  ML     █████░░░ 55%             │
└─────────────────────────┴───────────────────────────────────┘
```

---

## 17. Mentor Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Welcome, Prof. Priya — 12 students assigned               │
├──────────┬──────────┬──────────┬─────────────────────────── │
│ Assigned │ Pending  │ Upcoming │  Avg Readiness Score       │
│ Students │ Reviews  │Meetings  │  71%                       │
│    12    │    4     │    2     │                            │
├──────────┴──────────┴──────────┴─────────────────────────── │
│  Student Overview Table                                     │
│  Name          Resume  Learning  Interview  Actions         │
│  John Smith    72      65        74         ▶ View          │
│  Priya Kumar   58      80        60         ▶ View          │
│  Arjun Raj     85      90        82         ▶ View          │
├─────────────────────────────────────────────────────────────┤
│  Pending Reviews                                            │
│  John Smith — Resume v3 — 2h ago             [Review]      │
│  Priya Kumar — Interview — 5h ago            [View]        │
└─────────────────────────────────────────────────────────────┘
```

---

## 18. Admin Dashboard

```
┌────────────────────────────────────────────────────────────┐
│  NEXA AI Admin                         System: ● Healthy   │
├──────────┬──────────┬──────────┬─────────────────────────── │
│  Users   │ Active   │ AI Calls │  Avg Feedback             │
│  1,248   │   342    │  4,891   │   4.3/5                  │
├──────────┴──────────┴──────────┴─────────────────────────── │
│  AI Provider Health                                        │
│  ● OpenAI GPT-4o    1.2s  ● Healthy                       │
│  ● Gemini Pro       0.9s  ● Healthy                        │
│  ● Claude 3.5       1.5s  ● Healthy                        │
├─────────────────────────┬──────────────────────────────────┤
│  Registrations (30d)    │  Course Enrollments (by category)│
│  [Line Chart]           │  [Bar Chart]                     │
└─────────────────────────┴──────────────────────────────────┘
```

---

## 19. Career Guidance Page

```
Career Guidance
  ├── Top Career Matches (from AI)
  │     ├── "AI Engineer"        — 84% match
  │     ├── "ML Engineer"        — 78% match
  │     └── "Data Scientist"     — 71% match
  ├── Skill Gap Analysis
  │     ├── Target role dropdown
  │     ├── Have: Python ✓  ML ✓  FastAPI ✓
  │     └── Need: Docker ✗  Kubernetes ✗  (with course links)
  ├── Salary Range Chart
  │     └── Entry / Mid / Senior bar chart
  └── Companies Hiring
        └── Card grid: logo + role + skills + apply link
```

---

## 20. Resume Module

### Resume Hub Page Structure

```
Resume Hub
  ├── Drag & Drop Upload Zone   (PDF / DOCX, max 5MB)
  ├── Version List
  │     ├── v3 — July 3 — Primary — ATS: 72 — [Analyze] [Download]
  │     ├── v2 — June 15          — ATS: 64
  │     └── v1 — June 1           — ATS: 51
  └── Analysis Panel (when resume selected)
        ├── ATSScoreCard   (circular progress + sub-scores)
        ├── SuggestionsList (prioritized improvements)
        └── MissingKeywords (chips/tags)
```

---

## 21. Learning Management System

### Lesson Page Layout

```
┌──────────────────────────────────┬──────────────────────────┐
│  VIDEO PLAYER                    │  LESSON LIST             │
│  ┌────────────────────────────┐  │  Module 1: Basics        │
│  │  Course Video Content      │  │  ✓ Lesson 1: Setup       │
│  └────────────────────────────┘  │  ✓ Lesson 2: Variables   │
│  ████████████░░  65%  14:23      │  ▶ Lesson 3: Functions   │
│                                  │  ○ Lesson 4: OOP         │
│  NOTES                           │                          │
│  Key takeaways from this lesson  │  Progress: 65%  13/20   │
│                                  │  ████████░░ complete     │
│  [Start Quiz →]                  │                          │
└──────────────────────────────────┴──────────────────────────┘
```

---

## 22. Interview Coach

### Active Session + Score Report

```
Active Interview — Backend Developer — Technical (Q 3/10)  ⏱ 02:15
─────────────────────────────────────────────────────────────────
"Explain the difference between SQL and NoSQL databases."

[Your answer textarea]

[Skip]                                            [Submit Answer →]

─────────────────────────────────────────────────────────────────

Score Report — Overall: 74/100
  Technical:     72    Communication: 80    Confidence: 68
  Q1 SQL/NoSQL:  82 ✓  Q2 REST/GQL:   75 ✓  Q3 Caching: 68 ⚠

  AI Feedback: Study distributed systems, caching patterns.
  [Download PDF]    [Retry Interview]
```

---

## 23. Coding Platform

```
NEXA AI Coding Assistant
─────────────────────────────────────────────────────────────
Language: [Python ▼]    Action: [Explain] [Debug] [Generate] [Optimize]
─────────────────────────────────────────────────────────────
MONACO EDITOR
  1  def two_sum(nums, target):
  2      seen = {}
  3      for i, n in enumerate(nums):
  4          if target - n in seen:
  5              return [seen[target - n], i]
  6          seen[n] = i
─────────────────────────────────────────────────────────────
                                     [▶ Send to NEXA AI]
─────────────────────────────────────────────────────────────
AI EXPLANATION
This uses a hash map for O(n) time. For each element, we check
if its complement (target - n) already exists in the map...

Time: O(n)    Space: O(n)    Difficulty: Easy
```

---

## 24. Analytics Dashboard

### Chart Inventory

| Chart                 | Type    | Data                              |
|-----------------------|---------|-----------------------------------|
| Learning Hours (30d)  | Bar     | Hours per day                     |
| Skill Growth          | Radar   | Skill levels across 6 dimensions  |
| Resume Score Trend    | Line    | ATS score per upload              |
| Placement Readiness   | Gauge   | 0–100% donut chart                |
| AI Usage by Agent     | Doughnut| % usage per agent                 |
| Interview Scores      | Bar     | Score per session                 |

---

## 25. Form Standards

### React Hook Form + Zod Pattern

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        id="email"
        type="email"
        {...register('email')}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm
                   text-text-primary placeholder-text-muted outline-none
                   focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        placeholder="john@example.com"
        aria-describedby={errors.email ? 'email-error' : undefined}
      />
      {errors.email && (
        <p id="email-error" className="mt-1 text-xs text-danger">{errors.email.message}</p>
      )}
      <Button type="submit" loading={isSubmitting} className="mt-4 w-full">
        Sign In
      </Button>
    </form>
  )
}
```

### Form Rules

| Rule                       | Implementation                                  |
|----------------------------|-------------------------------------------------|
| Client-side validation     | Zod schema via `zodResolver`                   |
| Error shown below input    | `errors.field.message` in red `text-danger`    |
| Submit spinner             | `loading` prop on `Button`                     |
| Prevent double submit      | `disabled={isSubmitting}`                      |
| Accessibility              | `htmlFor` + `aria-describedby` on every field  |
| Success feedback           | `toast.success()` after mutation               |

---

## 26. Loading & Error States

### Page Loader

```typescript
export function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-brand-500" />
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    </div>
  )
}
```

### Empty State

```typescript
interface EmptyStateProps {
  icon:        LucideIcon
  title:       string
  description: string
  action?:     { label: string; onClick: () => void }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border py-16">
      <div className="rounded-full bg-surface p-4">
        <Icon size={32} className="text-text-muted" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-text-primary">{title}</p>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
      {action && <Button variant="secondary" onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
}
```

---

## 27. Accessibility Standards

| Requirement           | Implementation                                             |
|-----------------------|------------------------------------------------------------|
| Keyboard navigation   | All elements reachable via Tab                            |
| Focus indicators      | `focus-visible:ring-2 focus-visible:ring-brand-500`       |
| Semantic HTML         | `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>`     |
| ARIA labels           | `aria-label` on all icon-only buttons                    |
| Color contrast        | 4.5:1 minimum for normal text                             |
| Error association     | `aria-describedby` linking inputs to error messages       |
| Live regions          | `aria-live="polite"` on AI response area                 |
| Alt text              | Required on all `<img>` elements                          |

---

## 28. Performance Strategy

### Code Splitting

```typescript
// All routes lazy loaded — Monaco Editor only on /coding
const MonacoEditor = lazy(() => import('@monaco-editor/react'))
```

### Bundle Size Targets

| Bundle          | Target  | Strategy                              |
|-----------------|---------|---------------------------------------|
| Initial JS      | < 150KB | Lazy load all routes                  |
| Vendor chunk    | < 250KB | Split react, redux, charts separately |
| Monaco Editor   | < 2MB   | Load only on `/coding` page           |
| Total initial   | < 400KB | Code splitting + tree shaking         |

### React Query Cache Strategy

```typescript
// Aggressive caching — minimize re-fetching
useQuery({
  queryKey:  ['courses'],
  queryFn:   courseService.list,
  staleTime: 5 * 60 * 1000,  // Fresh for 5 minutes
})
```

---

## 29. Frontend Security

| Rule                              | Implementation                                     |
|-----------------------------------|----------------------------------------------------|
| Access token storage              | `localStorage` (HttpOnly cookie for refresh token) |
| No sensitive data in URLs         | User IDs never in query parameters                 |
| File validation before upload     | Type + size check on client before API call        |
| Prevent double submit             | `disabled={isSubmitting}` on all form buttons      |
| No `dangerouslySetInnerHTML`      | Use `react-markdown` for AI responses only         |
| HTTPS enforced                    | Nginx + HSTS header                                |
| Auto token refresh                | Axios interceptor handles 401 transparently        |
| Logout clears all state           | Redux `logout` + `localStorage.clear()`            |

---

## 30. Implementation Standards

### Component Conventions

| Convention                | Rule                                                |
|---------------------------|-----------------------------------------------------|
| File naming               | `PascalCase.tsx` for components                    |
| One component per file    | No multiple default exports                        |
| Props interface required  | Always define `interface XxxProps`                 |
| `cn()` for classNames     | Never string concatenation for Tailwind classes    |
| Framer Motion animations  | All enter/exit animations via Framer Motion        |
| `useQuery` for API data   | Never `useState + useEffect` for async data        |
| Form = RHF + Zod          | No custom form state management                    |

### Naming Conventions

| Element        | Convention   | Example                        |
|----------------|--------------|--------------------------------|
| Component      | PascalCase   | `ATSScoreCard.tsx`             |
| Hook           | camelCase    | `useAIChat.ts`                 |
| API Service    | camelCase    | `chatService.ts`               |
| Redux Slice    | camelCase    | `authSlice.ts`                 |
| Type/Interface | PascalCase   | `ChatMessage`, `UserProfile`   |
| CSS            | Tailwind only| No custom CSS class names      |

---

## Phase Summary

| Phase | Document                              | Status     |
|-------|---------------------------------------|------------|
| 1     | Software Requirements Spec (SRS)      | ✅ Complete |
| 2     | Functional Requirements (FRS)         | ✅ Complete |
| 3     | Non-Functional Requirements (NFR)     | ✅ Complete |
| 4     | System Architecture Design (SAD)      | ✅ Complete |
| 5     | Technology Stack & Dev Standards      | ✅ Complete |
| 6     | Database Design & MongoDB Arch (DDA)  | ✅ Complete |
| 7     | Backend Architecture & FastAPI (BAD)  | ✅ Complete |
| 8     | Frontend Architecture & UI/UX (FAD)   | ✅ Complete |

---

> **Phase 8 Complete** — Full React 19 architecture, design system, Tailwind config, all page layouts, component code with Framer Motion, WebSocket AI chat, routing strategy, state management, and performance plan defined.
>
> **Next: Phase 9 — Authentication Module (Implementation Blueprint)**
> Every API endpoint, JWT RS256 lifecycle, refresh token strategy, Beanie models, FastAPI routers, React authentication flow, OAuth2 integration, session management, RBAC middleware, sequence diagrams, error responses, and security best practices — fully implementation-ready.

---

*NEXA AI FAD — Phase 8 of 30 | Version 1.0 | July 2026*
