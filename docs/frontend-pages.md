# NEXA AI — Frontend Page Specifications
## Product Design & Interface Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | Frontend Page Specifications                             |
| **Version**        | 1.0                                                      |
| **UI Paradigm**    | Neon Glassmorphism Premium Theme                         |
| **Framework**      | React 19 + TypeScript                                    |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## 1. Unified Interface Core Pages

```
NEXA AI Pages Map

├── Public Pages
│   ├── Landing Page
│   └── Authentication (Login & Signup)
│
├── Dashboard Platform
│   ├── Student Dashboard Home
│   ├── Career Guidance Center
│   ├── Resume Intelligence Center
│   └── Mock Interview Simulator
│
└── Learning Platform
    ├── Course Catalog Listing
    ├── Video Player & Notes
    └── Monaco Coding Lab Panel
```

---

## 2. Core Page Specifications

### 2.1 Public Pages

#### 2.1.1 Landing Page
*   **Purpose:** Expose platform capabilities, features, pricing tiers, and call-to-actions to new visitors.
*   **Components:** Hero Banner, Feature grid, Testimonials slider, Pricing card block.
*   **API Calls:** None (Static landing).
*   **Buttons:**
    *   `Get Started` ➜ Redirects to `/register`.
    *   `Watch Demo` ➜ Opens modal streaming demo video.
*   **Forms:** None.
*   **Cards:** 6 feature cards detailing ATS, LMS, and AI-OS capabilities.
*   **Tables & Charts:** None.
*   **Permissions:** Public.
*   **Loading & Empty States:** None (Static load).
*   **Error States:** None.
*   **Responsive Behavior:** 1-column layout on mobile, transitioning to a 3-column grid on desktops.

#### 2.1.2 Authentication (Login & Signup)
*   **Purpose:** Authenticate users and set secure tokens.
*   **Components:** Auth card layout, Google/GitHub social logins.
*   **API Calls:** `POST /auth/login`, `POST /auth/register`.
*   **Buttons:**
    *   `Sign In / Register` ➜ Submits credentials.
    *   `OAuth Google` ➜ Redirects to OAuth consent flow.
*   **Forms:** Login/Signup form validated using `yup`/`zod` schemas.
*   **Cards:** Centered auth card with border glow.
*   **Tables & Charts:** None.
*   **Permissions:** Public.
*   **Loading & Error States:** Shimmer overlay on form submission, showing clear error banners on incorrect credentials.
*   **Responsive Behavior:** Stacked single column on mobile, centered card layout on desktops.

---

### 2.2 Dashboard Platform

#### 2.2.1 Student Dashboard Home
*   **Purpose:** The central portal showing the student's overall progress, learning milestones, and AI recommendations.
*   **Components:** Stat cards grid, Activity charts, Recommendation widgets.
*   **API Calls:** `GET /profile/me`, `GET /learning/progress`, `GET /recommend/career`.
*   **Buttons:**
    *   `Resume Interview` ➜ Redirects to active mock session.
    *   `Explore Courses` ➜ Redirects to the LMS catalog.
*   **Forms:** None.
*   **Cards:** Stat cards for Career readiness score ($25\%$), Resume score ($15\%$), and Learning progress ($15\%$).
*   **Tables & Charts:** Line chart showing weekly study progress and bar chart showing mock interview scores.
*   **Permissions:** Student, Mentor, Admin.
*   **Loading & Empty States:** Skeleton cards render during fetching. Empty states prompt the user: *"Upload a resume to begin."*
*   **Responsive Behavior:** Vertical stack on mobile, multi-column dashboard grid on desktops.

#### 2.2.2 Resume Intelligence Center
*   **Purpose:** Upload resumes, view parsed sections, evaluate ATS compatibility, and run optimizations.
*   **Components:** Drag-and-drop file uploader, parsed sections tabs, optimization editor.
*   **API Calls:** `POST /resume/upload`, `POST /resume/analyze`, `POST /resume/optimize`.
*   **Buttons:**
    *   `Upload PDF` ➜ Triggers file picker.
    *   `Rewrite Bullet` ➜ Calls the AI rewriter to optimize bullet points.
*   **Forms:** Upload form validated using file size constraints ($max\ 4MB$).
*   **Cards:** Grid cards showing parsed contact info, skills, and work history.
*   **Tables & Charts:** Progress bar showing the calculated ATS score.
*   **Permissions:** Student, Mentor, Admin.
*   **Loading & Error States:** Shimmer overlay shows parsing progress. File format errors show clear alert banners.
*   **Responsive Behavior:** Tabs collapse into dropdown menus on mobile, dual-panel split screen on desktops.

---

### 2.3 Learning Platform

#### 2.3.1 Monaco Coding Lab Panel
*   **Purpose:** Code compilation IDE supporting Python, Java, and C++, integrated with AI code explanation.
*   **Components:** Monaco editor workspace, Console output panel, Test cases tab, AI tutor sidebar.
*   **API Calls:** `POST /coding/run`, `POST /coding/submit`, `POST /coding/explain`.
*   **Buttons:**
    *   `Run Code` ➜ Evaluates code against test cases in the sandbox container.
    *   `Ask AI Tutor` ➜ Sends the code block to the AI tutor for feedback.
*   **Forms:** None.
*   **Cards:** Test case evaluation cards showing pass/fail status.
*   **Tables & Charts:** None.
*   **Permissions:** Student, Mentor, Admin.
*   **Loading States:** Compilation triggers a spinner in the console panel.
*   **Responsive Behavior:** Editor resizing is optimized for desktop, with touch options enabled for tablet viewports.

---

## 3. Operational Performance SLA Targets

To ensure a responsive interface, page views are designed to load within strict latency targets:

| Page View | Loading Target | Metric SLA Target |
| :--- | :--- | :--- |
| **Landing Page** | First Contentful Paint | Target: ≤ 1.5 seconds |
| **Dashboard Home** | Fetching API stats | Target: ≤ 450 ms |
| **Monaco Coding Lab** | Editor mount time | Target: ≤ 300 ms |
| **Mock Interview Coach**| Dynamic question load | Target: ≤ 200 ms |
| **Chart Redraw** | Chart rendering speed | Target: ≤ 120 ms |

---

*NEXA AI Page Specifications | Version 1.0 | July 2026*
