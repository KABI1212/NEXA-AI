# NEXA AI Developer Guide: React Style Guide

---

## 1. Component Design

*   **Conformance:** Build components as functional React components with hooks.
*   **Target Engine:** **React 19 + TypeScript + Vite**.
*   **Styling:** Use standard CSS variables mapped to Tailwind directives.

---

## 2. Type Interfaces

*   Every component prop interface must declare explicit TypeScript type annotations.
*   Avoid using `any`. Use custom types from `shared/types`.

```typescript
interface ButtonProps {
  label:      string
  variant?:   'primary' | 'secondary' | 'glass'
  isDisabled?: boolean
  onClick:    () => void
}
```

---

## 3. State Management

*   Use **Zustand** for lightweight global client state slices (e.g., active user sessions, themes).
*   Use **TanStack Query** for caching and managing server-side state.
