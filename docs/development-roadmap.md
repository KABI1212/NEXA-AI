# NEXA AI — Development Roadmap & Milestones
## 12-Week Implementation Timeline & Project Delivery Plan

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | Development Roadmap & Weekly Milestones                  |
| **Version**        | 1.0                                                      |
| **Project Span**   | 12 Weeks (Total estimated duration)                      |
| **Frameworks**     | React 19 + FastAPI 0.115 + LangGraph                    |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## 1. Development Gantt Timeline

```
Week  │ 1  2  3  4  5  6  7  8  9 10 11 12 │ Tasks / Milestone Groups
──────┼────────────────────────────────────┼──────────────────────────────────────
W1-2  │ ████                               │ Auth & Identity Foundation
W3-4  │      ████                          │ Resume Parsing & ATS Intelligence
W5-6  │           ████                     │ Monaco Coding Lab Sandbox
W7-8  │                ████                │ LangGraph Multi-Agent Engine
W9-10 │                     ████           │ RAG & Memory Context Integrations
W11   │                          ██        │ Performance Tuning & Security Scans
W12   │                             ████   │ Deployment & Release Packaging
```

---

## 2. Weekly Milestones & Deliverables

### 2.1 Milestone Phase 1: Core Setup & Auth (Weeks 1 - 2)
*   **Weekly Tasks:**
    *   **Week 1:** Setup the project directory structure, configure Beanie MongoDB connections, and configure Redis caching clients.
    *   **Week 2:** Implement JWT token signing and refresh interceptors.
*   **Estimated Hours:** 45 Hours.
*   **Dependencies:** None.
*   **Difficulty:** Medium.
*   **Priority:** Critical.
*   **Deliverables:** Docker Compose configuration with working database and Redis containers. User login and registration APIs.
*   **Risks & Mitigation:** Database connection timeouts during setup. Resolved by implementing retry logic in connection managers.

### 2.2 Milestone Phase 2: Resume Parsing & ATS (Weeks 3 - 4)
*   **Weekly Tasks:**
    *   **Week 3:** Integrate `pdfplumber` to extract text from resumes and map sections.
    *   **Week 4:** Implement matching calculations to evaluate keyword fits.
*   **Estimated Hours:** 50 Hours.
*   **Dependencies:** Weeks 1 - 2.
*   **Difficulty:** High.
*   **Priority:** High.
*   **Deliverables:** Drag-and-drop file uploader and parsed resume sections view in the UI. Backend parser APIs.
*   **Risks & Mitigation:** Slow parsing speeds on large PDF files. Resolved by parsing files asynchronously using Celery background workers.

---

### 2.3 Milestone Phase 3: AI OS & Agent Registry (Weeks 7 - 8)
*   **Weekly Tasks:**
    *   **Week 7:** Build state graphs, define graph nodes, and configure routing edges using LangGraph.
    *   **Week 8:** Implement fallback checks and register specialized agents.
*   **Estimated Hours:** 60 Hours.
*   **Dependencies:** Weeks 3 - 4.
*   **Difficulty:** High.
*   **Priority:** High.
*   **Deliverables:** Modular orchestrator class that routes chat queries based on user intent.
*   **Risks & Mitigation:** Unpredictable LLM response formats. Resolved by implementing custom validation nodes to enforce structural consistency.

---

## 3. Operational Performance SLA Targets

To ensure a smooth user experience, operations are designed to match strict latency targets:

| Milestone Phase | SLA Limit | Performance Target |
| :--- | :--- | :--- |
| **Auth API Setup** | Response latency | Target: ≤ 100 ms |
| **Resume Parsing** | Parsed text extraction | Target: ≤ 2500 ms |
| **Sandbox Execution** | Container run latency | Target: ≤ 2900 ms |
| **Graph Route Check** | Orchestrator traversal | Target: ≤ 750 ms |
| **Vector Search RAG** | Qdrant + Cohere Rerank | Target: ≤ 570 ms |

---

*NEXA AI Development Roadmap | Version 1.0 | July 2026*
