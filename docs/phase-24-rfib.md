# NEXA AI — React Frontend Implementation Blueprint (RFIB)
## Phase 24 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | React Frontend Implementation Blueprint                  |
| **Phase**          | 24 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Framework**      | React 19 + Vite 6 + TypeScript                           |
| **Architecture**   | Domain/Feature-Based Architecture                        |
| **State Managers** | Zustand (Global) + TanStack Query v5 (Server)            |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [Feature-Based Frontend Folder Structure](#1-feature-based-frontend-folder-structure)
2. [Vite Configuration & Chunk Splitting](#2-vite-configuration--chunk-splitting)
3. [Core Router & Navigation Layouts](#3-core-router--navigation-layouts)
4. [Zustand Global State Stores](#4-zustand-global-state-stores)
5. [TanStack Query Hooks & Cache Strategy](#5-tanstack-query-hooks--cache-strategy)
6. [Monaco Code Sandbox Component](#6-monaco-code-sandbox-component)
7. [Tailwind CSS variables & Theming Config](#7-tailwind-css-variables--theming-config)
8. [GDPR Anonymization & Local Storage Purge Policy](#8-gdpr-anonymization--local-storage-purge-policy)
9. [Performance SLA Targets Matrix](#9-performance-sla-targets-metrics)

---

## 1. Feature-Based Frontend Folder Structure

The frontend is organized by domain features rather than file type, keeping pages, components, and API client scripts modular.

```
frontend/src/
├── app/                      # Entry configurations
│   ├── App.tsx
│   ├── main.tsx
│   └── routes.tsx            # Global Route declarations
├── features/                 # Self-contained domain modules
│   ├── auth/                 # Login, signup views
│   ├── career/               # Match charts, roadmaps
│   ├── resume/               # PDF upload, ATS reviews
│   └── coding/               # Monaco panels, compiler stubs
├── shared/                   # Global reusable libraries
│   ├── components/           # Button, Card, Dialog
│   ├── hooks/                # useAuth, useTheme
│   ├── styles/               # CSS variables index
│   └── types/                # Core domain TS interfaces
```

---

## 2. Vite Configuration & Chunk Splitting

Vite is configured to split vendor dependencies (like Monaco, Recharts, and Redux) into separate bundles to optimize page load speeds.

```typescript
// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Splitting large vendor packages
          if (id.includes('node_modules')) {
            if (id.includes('monaco-editor')) {
              return 'vendor-monaco';
            }
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react-core';
            }
            return 'vendor-libs';
          }
        }
      }
    }
  }
})
```

---

## 3. Core Router & Navigation Layouts

We use lazy-loaded routes with suspense fallbacks, protecting paths based on user role permissions.

```typescript
// frontend/src/app/routes.tsx
import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import DashboardLayout from '@/shared/layouts/DashboardLayout'

// Lazy Load pages
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const DashboardHome = lazy(() => import('@/features/career/pages/DashboardHome'))
const ResumeUpload = lazy(() => import('@/features/resume/pages/ResumeUpload'))
const MonacoCodingLab = lazy(() => import('@/features/coding/pages/CodingLab'))

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading...</div>}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: 'dashboard', element: <DashboardHome /> },
      { path: 'resume', element: <ResumeUpload /> },
      { path: 'coding', element: <MonacoCodingLab /> },
      { path: '*', element: <Navigate to="/dashboard" replace /> }
    ]
  }
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
```

---

## 4. Zustand Global State Stores

Zustand handles global client-side variables (like theme and user authentication state) with lightweight actions.

```typescript
// frontend/src/shared/store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id:        string
  email:     string
  role:      string
  fullName:  string
}

interface AuthState {
  user:        User | null
  accessToken: string | null
  setAuth:     (user: User, token: string) => void
  clearAuth:   () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, token) => set({ user, accessToken: token }),
      clearAuth: () => set({ user: null, accessToken: null }),
    }),
    {
      name: 'nexa-auth-store',
    }
  )
)
```

---

## 5. TanStack Query Hooks & Cache Strategy

TanStack Query manages server-side data fetching and API caching.

```typescript
// frontend/src/features/career/hooks/useCareerMatch.ts
import { useQuery } from '@tanstack/react-query'
import api from '@/shared/services/api'

interface CareerMatchData {
  match:       number
  role:        string
  explanation: string
}

export function useCareerMatch() {
  return useQuery<CareerMatchData>({
    queryKey: ['career-match'],
    queryFn: async () => {
      const { data } = await api.post('/recommend/career')
      return data.data
    },
    staleTime: 1000 * 60 * 5,     # Keep cache fresh for 5 minutes
    gcTime:    1000 * 60 * 30,    # Retain cache for 30 minutes
    retry:     2
  })
}
```

---

## 6. Monaco Code Sandbox Component

Integrates the Monaco Editor to run coding labs and receive real-time execution feedback.

```typescript
// frontend/src/features/coding/components/MonacoEditor.tsx
import { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'

interface EditorProps {
  value:        string
  language:     string
  onChange:     (val: string) => void
}

export function MonacoEditor({ value, language, onChange }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value,
        language,
        theme: 'vs-dark',
        minimap: { enabled: false },
        automaticLayout: true,
      })

      editorRef.current.onDidChangeModelContent(() => {
        onChange(editorRef.current?.getValue() || '')
      })
    }

    return () => {
      editorRef.current?.dispose()
    }
  }, [language])

  return <div ref={containerRef} className="h-96 w-full border border-border rounded-lg" />
}
```

---

## 7. Tailwind CSS Variables & Theming Config

```css
/* frontend/src/shared/styles/theme.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --border: 214.3 31.8% 91.4%;
    --primary: 221.2 83.2% 53.3%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210.40% 98%;
    --card: 222.2 84% 4.9%;
    --border: 217.2 32.6% 17.5%;
    --primary: 217.2 91.2% 59.8%;
  }
}
```

---

## 8. GDPR Anonymization & Local Storage Purge Policy

For privacy protection and data hygiene, logging out clears the local storage store containing auth tokens.

```typescript
// frontend/src/features/auth/hooks/useLogout.ts
import { useAuthStore } from '@/shared/store/authStore'
import { useQueryClient } from '@tanstack/react-query'

export function useLogout() {
  const clearAuth = useAuthStore(state => state.clearAuth)
  const queryClient = useQueryClient()

  const logoutUser = () => {
    // 1. Purge client side storage cache
    clearAuth()
    
    // 2. Invalidate server state cache
    queryClient.clear()
    
    // 3. Force browser redirection to login
    window.location.href = '/login'
  }

  return logoutUser
}
```

---

## 9. Performance SLA Targets Metrics

To ensure a smooth user experience, UI components are audited against these target speeds:

| UI Operation | SLA Limit | Verification Metric |
| :--- | :--- | :--- |
| **Initial Load (FCP)** | Raw bundle delivery | Target: ≤ 1.5 seconds |
| **Monaco Mount Time** | Code editor start | Target: ≤ 350 ms |
| **Route Swap transition**| Page navigation time | Target: ≤ 180 ms |
| **Zustand state write** | Local storage save | Target: ≤ 10 ms |
| **Chart Render Swap** | Recharts update time | Target: ≤ 120 ms |

---

## Phase Summary

| Phase | Document                                  | Status     |
|-------|-------------------------------------------|------------|
| 1     | Software Requirements Spec (SRS)          | ✅ Complete |
| 2     | Functional Requirements (FRS)             | ✅ Complete |
| 3     | Non-Functional Requirements (NFR)         | ✅ Complete |
| 4     | System Architecture Design (SAD)          | ✅ Complete |
| 5     | Technology Stack & Dev Standards          | ✅ Complete |
| 6     | Database Design & MongoDB Arch (DDA)      | ✅ Complete |
| 7     | Backend Architecture & FastAPI (BAD)      | ✅ Complete |
| 8     | Frontend Architecture & UI/UX (FAD)       | ✅ Complete |
| 9     | Authentication & Authorization System     | ✅ Complete |
| 10    | AI Multi-Agent System Architecture (AMSA)  | ✅ Complete |
| 11    | LangGraph Orchestrator & Workflow Engine  | ✅ Complete |
| 12    | AI Memory & Personalization Engine (AMPE)  | ✅ Complete |
| 13    | RAG & Knowledge Base Architecture          | ✅ Complete |
| 14    | AI Career Recommendation Engine (ACRE)     | ✅ Complete |
| 15    | AI Career Guidance Agent (CGA)            | ✅ Complete |
| 16    | AI Resume Intelligence System (RAIOS)      | ✅ Complete |
| 17    | AI Interview Coach System (AICPPS)        | ✅ Complete |
| 18    | AI Learning Management System (AI-LMS)     | ✅ Complete |
| 19    | Feedback & System Intelligence (FCLSIP)   | ✅ Complete |
| 20    | Production Deployment & DevOps (PDO)      | ✅ Complete |
| 21    | Complete REST API Specification (OpenAPI)  | ✅ Complete |
| 22    | MongoDB Models & Beanie Design (MBDD)     | ✅ Complete |
| 23    | FastAPI Backend Implementation (FBIB)     | ✅ Complete |
| 24    | React Frontend Implementation (RFIB)      | ✅ Complete |

---

> **Phase 24 Complete** — Vite bundler parameters, lazy routing structures, Zustand store setups, Monaco mount points, and Tailwind themes defined.
>
> **Next: Phase 25 — LangGraph & AI Agent Implementation Guide**
> Node state mappings, conditional edge codes, parallel tool dispatchers, and custom prompt string files.

---

*NEXA AI Phase 24 — React Frontend Blueprint | Version 1.0 | July 2026*
