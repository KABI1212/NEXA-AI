# NEXA AI — Project Documentation & Placement Package (PDTPP)
## Phase 28 — Implementation Blueprint

---

| Field              | Details                                                  |
|--------------------|----------------------------------------------------------|
| **Document**       | Project Documentation & Placement Package                |
| **Phase**          | 28 of 30                                                 |
| **Version**        | 1.0                                                      |
| **Doc Standards**  | IEEE Transactions Style + Software Engineering SDD      |
| **Release Type**   | Production Ready Release package                         |
| **Status**         | ✅ Complete — Implementation Ready                      |

---

## Table of Contents

1. [Technical Documentation Folder Structure](#1-technical-documentation-folder-structure)
2. [Project Report Outline (120-150 Pages)](#2-project-report-outline-120-150-pages)
3. [IEEE Conference Paper Draft Layout](#3-ieee-conference-paper-draft-layout)
4. [25-Slide Placement PPT Outline](#4-25-slide-placement-ppt-outline)
5. [10-Step Interactive Demo Script](#5-10-step-interactive-demo-script)
6. [Viva/Panel Q&A Preparation Cheat Sheet](#6-vivapanel-qa-preparation-cheat-sheet)
7. [GDPR & Release Readiness Checklist](#7-gdpr--release-readiness-checklist)
8. [Performance & Documentation Targets Matrix](#8-performance--documentation-targets-matrix)

---

## 1. Technical Documentation Folder Structure

The documentation and placement materials are organized under the `docs/` directory of the project.

```
docs/
├── srs.md                    # Software Requirements Specification
├── sdd.md                    # Software Design Document
├── database_guide.md         # Schema indexes & migration notes
├── api_spec.json             # OpenAPI exported file
├── reports/                  # Academic publications
│   ├── project_report.pdf
│   └── ieee_paper.pdf
├── presentation/             # Placement assets
│   ├── slides.pptx
│   └── demo_script.md
└── manuals/
    ├── user_guide.md
    └── admin_guide.md
```

---

## 2. Project Report Outline (120-150 Pages)

This outline maps out the academic report structure, complying with university project guidelines.

*   **Chapter 1: Abstract & Objectives**
    *   1.1 Project Summary
    *   1.2 Objectives & Scope
*   **Chapter 2: Literature Review & Gap Analysis**
    *   2.1 Existing Career Portals (e.g. LinkedIn, standard LMS)
    *   2.2 Gaps in Current Systems (Lack of personalized AI feedback, RAG grounding, multi-agent coordination)
*   **Chapter 3: Requirements Analysis**
    *   3.1 Functional Requirements (Auth, Resume, Learning, Interview modules)
    *   3.2 Non-Functional Requirements (Latency budgets, role permissions, GDPR PII checks)
*   **Chapter 4: System Architecture Design (SDD)**
    *   4.1 Modular Monolith Layer Diagram
    *   4.2 LangGraph Orchestrator flow edges
    *   4.3 MongoDB Document structures
*   **Chapter 5: Detailed Implementation Modules**
    *   5.1 FastAPI Backend Factory & Middleware
    *   5.2 React Feature-based Router & Zustand Stores
    *   5.3 Isolated Coding Compile Sandboxes
*   **Chapter 6: Results, Charts & Evaluation**
    *   6.1 k6 Load test graphs
    *   6.2 AI Semantic Accuracy reports
*   **Chapter 7: Conclusions & Future Scope**
    *   7.1 References (IEEE Bibliography Style)

---

## 3. IEEE Conference Paper Draft Layout

An 8-page draft layout detailing the system's architecture and AI orchestration logic.

*   **Title:** *NEXA AI: A Multi-Agent Intelligent Career Guidance and Adaptive Learning System using LangGraph and Clean Architecture.*
*   **Section I: Introduction** (Presents student placement challenges and the need for adaptive systems).
*   **Section II: Related Work** (Reviews LLMs, RAG, and multi-agent frameworks in education).
*   **Section III: Proposed System Architecture** (Details the LangGraph state machine, Qdrant semantic indexes, and isolated Docker sandboxes).
*   **Section IV: Methodology & Algorithms** (Exposes the weighted matching score formulas and STAR behavioral evaluator).
*   **Section V: Evaluation & Empirical Results** (Shows k6 throughput charts, latency metrics, and semantic accuracy tables).
*   **Section VI: Conclusion & Future Directions** (Outlines future support for voice simulation and multi-language learning).

---

## 4. 25-Slide Placement PPT Outline

Designed to highlight engineering decisions and technical depth to placement panel interviewers.

*   **Slide 1:** Project Title, Student Details, and Mentor Names.
*   **Slide 2:** Problem Statement (Standard career portals lack personalization).
*   **Slide 3:** Objectives (Adaptive paths, ATS checks, mock interviews).
*   **Slide 4:** Proposed System Architecture (System layer block diagram).
*   **Slide 5:** Technology Stack Selection (Why FastAPI, Beanie, Qdrant, React).
*   **Slide 6:** AI Multi-Agent Architecture (LangGraph node routing map).
*   **Slide 7:** Domain Data Layer (MongoDB models, base auditing, soft-delete rules).
*   **Slide 8:** Authentication & Security (JWT, OAuth2, Argon2id hashes, PII sanitizer).
*   **Slide 9:** AI Memory Engine (Facts, Preferences, Goals categories).
*   **Slide 10:** Grounded RAG Pipeline (Qdrant semantic index + Cohere Reranker).
*   **Slide 11:** Career Matcher (Explainability engine + match scoring formula).
*   **Slide 12:** Resume Analysis (PDF text parsing & ATS scoring logic).
*   **Slide 13:** Mock Interview Coach (Dynamic difficulty adjustments).
*   **Slide 14:** STAR Behavioral Evaluator (CheckingSituation, Task, Action, Result).
*   **Slide 15:** Coding Lab Sandbox (Docker code compilation isolation).
*   **Slide 16:** Adaptive LMS (Progress logs & verified certificate QR codes).
*   **Slide 17:** System Analytics (Loki logs, Prometheus metrics counters).
*   **Slide 18:** DevOps & Containers (Multi-stage Dockerfiles, Nginx configs).
*   **Slide 19:** CI/CD Quality Gates (GitHub Actions test coverage enforcement).
*   **Slide 20:** Verification & Testing (Pytest, mongomock, k6 load checks).
*   **Slide 21:** Live Video Demo (Demonstrating user journeys).
*   **Slide 22:** Engineering Impact Metrics (API latencies, token speeds).
*   **Slide 23:** Future Enhancements (Voice simulation, video checks).
*   **Slide 24:** Summary of Contributions (IEEE Paper publication details).
*   **Slide 25:** Q&A / Panel Discussion.

---

## 5. 10-Step Interactive Demo Script

This script walks through a 12-minute live demo showing the core user journey.

1.  **Register Account:** Register a new user, check for input validation warnings, and complete verification using the OTP sent to their email.
2.  **User Log In:** Sign in with the verified credentials to access the student dashboard.
3.  **AI Chat Query:** Open the AI Chat window and type *"I want to become an AI Engineer."* Watch the response stream in real time.
4.  **Upload Resume:** Drag-and-drop a PDF resume. View the parsed sections and the calculated ATS compatibility score.
5.  **Skill Gap Check:** View the missing skills flagged by the engine (e.g. Docker, MLOps).
6.  **Learning Roadmap:** Review the customized weekly learning milestones generated to bridge the skill gaps.
7.  **LMS Lesson:** Navigate to the Python lesson, complete a quiz, and view the updated progress metrics.
8.  **Coding Lab:** Solve a coding challenge in the Monaco editor and view the test case pass/fail results.
9.  **Mock Interview:** Start a mock interview, submit an answer, and view the STAR behavioral critique.
10. **Earn Certificate:** Complete the course, download the verified certificate, and view the QR validation check page.

---

## 6. Viva/Panel Q&A Preparation Cheat Sheet

Common questions asked by viva panels and technical interviewers:

*   **Q: Why choose MongoDB over PostgreSQL?**
    *   **A:** Career guidance profiles, resume parses, roadmaps, and chat history contain highly unstructured, evolving data structures. MongoDB's document model fits this naturally.
*   **Q: Why use LangGraph instead of a simple LLM query chain?**
    *   **A:** LangGraph models multi-agent workflows as stateful cyclic graphs. This allows state retention between execution nodes, parallel execution of independent agents, and human-in-the-loop validation checkpoints.
*   **Q: How does the ATS scoring engine evaluate resumes?**
    *   **A:** It computes a weighted score across multiple categories: Keyword matching ($25\%$), Skills validation ($20\%$), Formatting structure ($15\%$), and Experience ($15\%$).
*   **Q: How is the coding execution sandbox secured?**
    *   **A:** Submissions compile inside isolated Docker containers with strict memory limits ($64MB$), restricted CPU shares ($0.5$ cores), no network access, and a $3$-second runtime timeout.
*   **Q: How does the silent token refresh work?**
    *   **A:** When the short-lived access token expires, the client's Axios interceptor catches the 401 error, posts to the refresh endpoint with the HttpOnly refresh token cookie, rotates the tokens, and retries the original request.

---

## 7. GDPR & Release Readiness Checklist

Ensure the following criteria are met before pushing the code to production:

- [ ] All credentials and secrets are removed from the codebase and loaded via environment variables.
- [ ] Pytest coverage is at or above the $90\%$ target.
- [ ] Database backup scripts are configured and scheduled as automated cron jobs.
- [ ] The PII Sanitizer is running on all text inputs to redact email addresses and phone numbers.
- [ ] Let's Encrypt SSL certificates are verified and Nginx is configured to redirect HTTP to HTTPS.
- [ ] GDPR endpoints are tested to confirm users can successfully delete or export their data.

---

## 8. Performance & Documentation Targets Matrix

To ensure delivery quality, documentation and packaging tasks are measured against these targets:

| Package Stage | SLA Target Limit | Performance Target |
| :--- | :--- | :--- |
| **PDF Report Build** | Compiling LaTeX/Markdown | Target: ≤ 12.0 seconds |
| **Presentation Deck** | PPT slide layout validation | Target: 25 structured slides |
| **Demo Flow Execution** | Step-by-step walkthrough | Target: 10 clean steps |
| **Interactive Q&A** | Viva panels responses | Target: 12 key cheat questions |
| **Readiness Check** | Production release gate | Target: 100% check compliance |

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
| 28    | Project Documentation & Presentation Package| ✅ Complete |

---

> **NEXA AI Master Roadmap Completed!**
>
> All 28 design and implementation phases have been successfully defined. The documentation repository contains a complete architecture, database, API, frontend, backend, AI agent, testing, and operations blueprint for building a production-ready AI Career Guidance Platform.
>
> We are ready to begin coding based on these blueprints.

---

*NEXA AI Phase 28 — Project Documentation & Presentation | Version 1.0 | July 2026*
