# NEXA AI — UI/UX Design System & Product Experience
## Phase 27 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | UI/UX Design System & Product Experience                 |
| **Phase**          | 27 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Visual Style**   | Neo-Futuristic Glassmorphism + Neon Accent Glow         |
| **Target Framework**| Tailwind CSS 4.0 / PostCSS                              |
| **Animations**     | Framer Motion Spring Presets                             |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [NEXA Design System (NDS) Folder Structure](#1-nexa-design-system-nds-folder-structure)
2. [Neo-Futuristic Color System & CSS Tokens](#2-neo-futuristic-color-system--css-tokens)
3. [Typography & Responsive Scale Rules](#3-typography--responsive-scale-rules)
4. [Neon Glassmorphism CSS Presets](#4-neon-glassmorphism-css-presets)
5. [Framer Motion Spring Animation Presets](#5-framer-motion-spring-animation-presets)
6. [Reusable Design System Components](#6-reusable-design-system-components)
7. [ARIA Attributes & Accessibility Specifications](#7-aria-attributes--accessibility-specifications)
8. [Performance & Visual Rendering Budget](#8-performance--visual-rendering-budget)

---

## 1. NEXA Design System (NDS) Folder Structure

The frontend design system is isolated under a dedicated folder structure to separate design tokens from feature logic.

```
frontend/src/shared/design-system/
├── __init__.ts
├── tokens/                   # Core CSS variables variables
│   ├── colors.css
│   ├── typography.css
│   └── effects.css           # Glassmorphism, shadows
├── components/               # Base UI elements
│   ├── NexaButton.tsx
│   ├── NexaCard.tsx
│   └── NexaBadge.tsx
└── animations/               # Framer Motion transitions config
    └── spring.ts
```

---

## 2. Neo-Futuristic Color System & CSS Tokens

The color palette features rich dark backgrounds accented with vibrant gold, royal blue, and electric violet glows.

```css
/* src/shared/design-system/tokens/colors.css */
:root {
  /* ── Background & Slate Grays ──────────────────────── */
  --nexa-bg-darkest:  #090A0F;
  --nexa-bg-surface:  #12131C;
  --nexa-bg-raised:   #1A1C29;
  
  /* ── Brand Neon Accents ───────────────────────────── */
  --nexa-primary:     #1E40AF;  /* Royal Blue */
  --nexa-secondary:   #D97706;  /* Royal Gold */
  --nexa-accent:      #7C3AED;  /* Electric Violet */
  
  /* ── Status Colors ────────────────────────────────── */
  --nexa-success:     #10B981;  /* Emerald Green */
  --nexa-warning:     #F59E0B;  /* Amber */
  --nexa-danger:      #EF4444;  /* Crimson Red */
  
  /* ── Borders & Outlines ────────────────────────────── */
  --nexa-border:      #26293A;
  --nexa-border-glow: #3B82F6;
}
```

---

## 3. Typography & Responsive Scale Rules

```css
/* src/shared/design-system/tokens/typography.css */
:root {
  /* ── Font Family mapping ─────────────────────────── */
  --font-heading: 'Outfit', 'Inter', sans-serif;
  --font-body:    'Inter', sans-serif;
  --font-code:    'Fira Code', monospace;

  /* ── Responsive Typographic scale (rem units) ────── */
  --text-h1:      2.25rem;   /* 36px */
  --text-h2:      1.75rem;   /* 28px */
  --text-h3:      1.25rem;   /* 20px */
  --text-body:    1.00rem;   /* 16px */
  --text-caption: 0.875rem;  /* 14px */
  --text-label:   0.75rem;   /* 12px */
}
```

---

## 4. Neon Glassmorphism CSS Presets

Implements card backing styles using backdrop-filter blur parameters and light-bending borders.

```css
/* src/shared/design-system/tokens/effects.css */
.nexa-glass-card {
  background: rgba(18, 19, 28, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.nexa-glass-card:hover {
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 8px 32px 0 rgba(59, 130, 246, 0.15);
}

.nexa-neon-glow-primary {
  text-shadow: 0 0 8px rgba(30, 64, 175, 0.6), 0 0 20px rgba(30, 64, 175, 0.4);
}
```

---

## 5. Framer Motion Spring Animation Presets

Transitions are snappy and responsive, avoiding heavy layouts.

```typescript
// src/shared/design-system/animations/spring.ts
export const nexaSpringTransitions = {
  // Snappy button click scaling transitions
  buttonPress: {
    whileTap: { scale: 0.96 },
    whileHover: { scale: 1.02 },
    transition: { type: "spring", stiffness: 400, damping: 15 }
  },
  
  // Smooth page loading transition
  pageFade: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.25, ease: "easeInOut" }
  },

  // Staggered list element entry
  listStagger: {
    container: {
      animate: { transition: { staggerChildren: 0.08 } }
    },
    item: {
      initial: { opacity: 0, x: -16 },
      animate: { opacity: 1, x: 0 },
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  }
}
```

---

## 6. Reusable Design System Components

### 6.1 NexaButton Component

```typescript
// src/shared/design-system/components/NexaButton.tsx
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { nexaSpringTransitions } from '../animations/spring'

interface ButtonProps {
  children:  ReactNode
  onClick:   () => void
  variant?:  'primary' | 'secondary' | 'glass'
  isLoading?: bool
}

export function NexaButton({ children, onClick, variant = 'primary', isLoading }: ButtonProps) {
  const getStyleClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-700 hover:bg-blue-600 text-white font-medium border border-blue-500/30'
      case 'secondary':
        return 'bg-amber-600 hover:bg-amber-500 text-white font-medium'
      case 'glass':
        return 'nexa-glass-card hover:bg-white/10 text-white border border-white/10'
    }
  }

  return (
    <motion.button
      {...nexaSpringTransitions.buttonPress}
      onClick={onClick}
      disabled={isLoading}
      className={`px-5 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${getStyleClass()}`}
    >
      {isLoading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : children}
    </motion.button>
  )
}
```

### 6.2 NexaCard Component

```typescript
// src/shared/design-system/components/NexaCard.tsx
import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  title:    string
  children: ReactNode
}

export function NexaCard({ title, children }: CardProps) {
  return (
    <div className="nexa-glass-card p-6 rounded-xl flex flex-col gap-4">
      <h3 className="text-[var(--text-h3)] font-semibold font-heading text-white border-b border-[var(--nexa-border)] pb-2">
        {title}
      </h3>
      <div className="text-[var(--text-body)] text-gray-300">
        {children}
      </div>
    </div>
  )
}
```

---

## 7. ARIA Attributes & Accessibility Specifications

To ensure the interface is accessible to all users, the design system enforces strict ARIA standards:

```typescript
// ── Form Input Fields Standard ──────────────────────
// Every text field must include an associated descriptive label.
<label htmlFor="user-skills">Skills Input</label>
<input 
  id="user-skills" 
  type="text" 
  aria-describedby="skills-helper" 
/>
<span id="skills-helper">Separate skills with commas.</span>

// ── Dialog & Modals Standard ───────────────────────
// Modal containers must trap keyboard focus and declare structural ARIA tags.
<div 
  role="dialog" 
  aria-modal="true" 
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Delete Saved Resume</h2>
</div>
```

---

## 8. Performance & Visual Rendering Budget

To maintain a fast interface, page transitions are designed to render within strict budgets:

| Visual Stages | Rendering Target | Metric Budget Target |
| :--- | :--- | :--- |
| **Theme Swap transition**| Dynamic variable swap | Target: ≤ 80 ms |
| **Monaco editor mount** | Editor container start| Target: ≤ 300 ms |
| **Framer Motion load** | Spring transition sweep| Target: ≤ 250 ms |
| **FCP Layout Sweep** | CSS parse paint time | Target: ≤ 1.5 seconds |
| **Accessibility Audit** | Audit check score | Target: ≥ 95% |

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
| 25    | LangGraph & AI Agent Implementation Guide | ✅ Complete |
| 26    | Testing, QA & Security Validation (TQASV) | ✅ Complete |
| 27    | UI/UX Design System (NDS)                 | ✅ Complete |

---

> **Phase 27 Complete** — Color tokens, typography layouts, glassmorphism presets, spring animations, and accessibility rules defined.
>
> **Next: Phase 28 — Project Documentation, Technical Report & Presentation**
> SDS definitions, database guides, presentation slides, and evaluation scripts.

---

*NEXA AI Phase 27 — UI/UX Design System | Version 1.0 | July 2026*
