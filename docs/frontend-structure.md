# NEXA AI — React Frontend Structure Blueprint
## Production Folder Mapping & Layout Responsibilities

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | React Frontend Structure Blueprint                       |
| **Version**        | 1.0                                                      |
| **Framework**      | React 19 + Vite 6 + TypeScript                           |
| **Pattern**        | Domain/Feature-Based Structure                           |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## 1. Overall Directory Layout

The frontend directory structures are divided into core application components and business domain modules.

```
frontend/src/
├── app/
│   ├── App.tsx
│   ├── main.tsx
│   └── routes.tsx
├── features/
│   ├── auth/
│   ├── career/
│   ├── resume/
│   ├── learning/
│   ├── coding/
│   ├── chat/
│   └── analytics/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── layouts/
│   ├── services/
│   ├── store/
│   ├── styles/
│   └── types/
└── main.tsx
```

---

## 2. Directory Mappings & Layer Specifications

### 2.1 Feature Modules (`features/*`)
*   **Purpose:** Self-contained domain directories housing feature-specific pages, components, hooks, and types.
*   **Expected Components:**
    *   `auth/` (`LoginPage.tsx`, `SignupPage.tsx`, `ProtectedRoute.tsx`, `useAuth.ts`)
    *   `resume/` (`ResumeUpload.tsx`, `ATSReportCard.tsx`, `useResumeUpload.ts`)
    *   `coding/` (`CodingLab.tsx`, `MonacoEditor.tsx`, `useCodeCompiler.ts`)
*   **Responsibilities:** Enforces route boundaries and scopes feature logic to prevent cross-module pollution.
*   **Dependencies:** `react-router-dom`, `@tanstack/react-query`, `@/shared/components`.

### 2.2 Shared Components (`shared/components/*`)
*   **Purpose:** Modular UI elements used across the entire application.
*   **Expected Components:**
    *   `Button.tsx` (Supports variant states: primary, secondary, and glassmorphic)
    *   `Card.tsx` (Implements glassmorphic backing styles and borders)
    *   `Skeleton.tsx` (Provides loading shimmers for dashboard widgets)
*   **Responsibilities:** Renders accessible, consistent, and performant UI components.
*   **Dependencies:** `clsx`, `tailwind-merge`, `lucide-react`.

### 2.3 Shared State & Services (`shared/store/*` & `shared/services/*`)
*   **Purpose:** Manages global client variables and handles API network calls.
*   **Expected Components:**
    *   `authStore.ts` (Zustand slice storing active user contexts and tokens)
    *   `api.ts` (Axios client with automatic silent token refresh interceptors)
*   **Responsibilities:** Handles client token refreshes and manages global client variables.
*   **Dependencies:** `zustand`, `axios`.

### 2.4 Layouts & Layout Shells (`shared/layouts/*`)
*   **Purpose:** Structural navigation layouts containing headers, footers, and sidebars.
*   **Expected Components:**
    *   `DashboardLayout.tsx` (Implements collapsible sidebars and header slots)
*   **Responsibilities:** Manages mobile responsiveness and renders routing child outlets.
*   **Dependencies:** `react-router-dom`, `framer-motion`.

---

## 3. Operational Performance SLA Targets

To ensure a smooth user experience, frontend operations are designed to match strict latency targets:

| UI Operation | SLA Target Limit | Performance Target |
| :--- | :--- | :--- |
| **First Contentful Paint** | Loading page layout | Target: ≤ 1.5 seconds |
| **Monaco Editor Mount** | Mounting the editor | Target: ≤ 300 ms |
| **Zustand State Update** | State write transaction | Target: ≤ 10 ms |
| **Route Transition Swap** | Navigating between pages | Target: ≤ 180 ms |
| **Chart Render Sweep** | Redrawing charts | Target: ≤ 120 ms |

---

*NEXA AI Frontend Structure | Version 1.0 | July 2026*
