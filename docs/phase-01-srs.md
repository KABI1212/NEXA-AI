# NEXA AI — Software Requirements Specification (SRS)
## Enterprise AI-Based Career Guidance and Learning Platform

---

| Field             | Details                                      |
|-------------------|----------------------------------------------|
| **Document**      | Software Requirements Specification (SRS)   |
| **Phase**         | 1 of 30                                      |
| **Version**       | 1.0                                          |
| **Project**       | NEXA AI                                      |
| **Project Type**  | Major Placement Project                      |
| **Date**          | July 2026                                    |
| **Status**        | ✅ Complete                                  |

---

## Technology Stack Overview

| Layer               | Technology                               |
|---------------------|------------------------------------------|
| **Frontend**        | React + TypeScript + Vite + Tailwind CSS |
| **Backend**         | Python + FastAPI                         |
| **Database**        | MongoDB Atlas                            |
| **Cache**           | Redis                                    |
| **Vector Database** | Qdrant                                   |
| **AI Framework**    | LangGraph + LangChain                    |
| **Containerization**| Docker & Docker Compose                  |
| **Reverse Proxy**   | Nginx                                    |
| **Background Jobs** | Celery                                   |
| **Authentication**  | JWT + OAuth2                             |
| **Deployment**      | AWS / Azure / GCP                        |

---

## Table of Contents

1. [Project Introduction](#1-project-introduction)
2. [Problem Statement](#2-problem-statement)
3. [Objectives](#3-objectives)
4. [Target Users](#4-target-users)
5. [User Roles](#5-user-roles)
6. [Core Modules](#6-core-modules)
7. [AI-First Design Principles](#7-ai-first-design-principles)
8. [High-Level Functional Flow](#8-high-level-functional-flow)
9. [Success Criteria](#9-success-criteria)
10. [Expected Outcomes](#10-expected-outcomes)
11. [Phase Roadmap](#11-phase-roadmap)

---

## 1. Project Introduction

### 1.1 Project Name

**NEXA AI – Intelligent AI Career Guidance & Learning Platform**

### 1.2 Project Vision

NEXA AI is an enterprise-grade AI platform that empowers students, graduates, job seekers, and professionals to make informed career decisions through personalized guidance, adaptive learning, intelligent recommendations, and AI-assisted preparation.

The platform combines AI-powered mentoring, skill-gap analysis, resume evaluation, interview preparation, learning management, and career analytics into a single integrated ecosystem.

### 1.3 Project Scope

NEXA AI covers the full spectrum of career development — from self-discovery and skill assessment to learning roadmaps, interview readiness, and job placement. The platform is designed to serve as a persistent, intelligent companion through the entire career journey.

### 1.4 Document Purpose

This SRS is the authoritative reference document for all development phases and serves as the contract between stakeholders and the development team. It establishes:

- What the system must do (functional requirements)
- How it must perform (non-functional requirements)
- Who will use it (user roles and personas)
- How it will be structured (architecture and modules)
- How success will be measured (acceptance criteria)

---

## 2. Problem Statement

### 2.1 The Gap in Career Guidance

The modern career landscape is fragmented, complex, and rapidly evolving. Learners at every stage face a common set of unanswered questions:

- Which career is right for me based on my interests and strengths?
- Which skills should I learn, and in what order?
- How do I know if I am ready for job interviews?
- How can I improve my resume to pass Applicant Tracking Systems (ATS)?
- Which certifications will actually help my career?
- What projects should I build to stand out?
- Which jobs or internships match my current profile?

### 2.2 Limitations of Existing Platforms

| Platform Type            | Limitation                                               |
|--------------------------|----------------------------------------------------------|
| Online Course Platforms  | Static content, no personalized guidance                 |
| Job Portals              | Only job listings, no preparation support               |
| Resume Builders          | Templates only, no intelligent feedback                  |
| Career Counselors        | Expensive, not scalable, not available 24/7              |
| Interview Prep Apps      | Isolated from the broader career journey                 |

### 2.3 The NEXA AI Solution

NEXA AI addresses this gap by offering a **persistent AI mentor** that:

- Understands the user's background, goals, and learning style
- Tracks progress over time and adapts recommendations accordingly
- Provides actionable guidance at every step of the career journey
- Integrates all career development activities into one platform
- Delivers a personalized, continuously improving experience

---

## 3. Objectives

The primary objectives of NEXA AI are to:

| # | Objective                                                                            |
|---|--------------------------------------------------------------------------------------|
| 1 | Provide AI-driven career recommendations based on profile, interests, and market demand |
| 2 | Recommend personalized learning paths that adapt to progress and goals              |
| 3 | Analyze resumes and suggest specific, actionable improvements                        |
| 4 | Identify skill gaps for target roles and suggest remediation paths                  |
| 5 | Conduct AI-based mock interviews with real-time feedback                            |
| 6 | Support coding practice with explanations, hints, and evaluations                   |
| 7 | Recommend projects and certifications that strengthen the user's portfolio           |
| 8 | Track learning progress with visual dashboards and milestones                       |
| 9 | Enable mentor interactions between students and assigned mentors                    |
|10 | Deliver real-time analytics and placement readiness insights                        |

---

## 4. Target Users

### 4.1 Students

| Sub-Category      | Primary Need                                           |
|-------------------|--------------------------------------------------------|
| School Students   | Career exploration, interest-based guidance            |
| Undergraduates    | Placement preparation, skill development               |
| Postgraduates     | Specialization planning, advanced career guidance      |

### 4.2 Fresh Graduates

- Resume building and ATS optimization
- Placement and interview preparation
- Internship identification and guidance
- First job application strategy

### 4.3 Working Professionals

- Career transition planning
- Upskilling for current role advancement
- Promotion preparation
- Industry certification guidance

### 4.4 Mentors

- Monitoring assigned student progress
- Assigning and tracking learning plans
- Reviewing student achievements and performance
- Providing targeted improvement recommendations

### 4.5 Administrators

- User and role management
- AI model configuration
- Content management and publishing
- Platform usage analytics

---

## 5. User Roles

### 5.1 Student Role

**Description:** Primary end-user. Accesses all AI-powered career development features.

| Permission Category | Specific Actions                                                   |
|---------------------|--------------------------------------------------------------------|
| Account             | Register, log in, manage profile, change password                 |
| AI Interaction      | Chat with AI mentor, request career recommendations               |
| Resume              | Upload resume, receive analysis, view ATS score, download report  |
| Learning            | View roadmaps, access courses, take quizzes, track progress       |
| Interview Prep      | Participate in mock interviews, receive AI feedback               |
| Feedback            | Submit ratings, write reviews, report issues                      |

---

### 5.2 Mentor Role

**Description:** Experienced professional assigned to guide students through their career journey.

| Permission Category  | Specific Actions                                                  |
|----------------------|-------------------------------------------------------------------|
| Learner Management   | View assigned learners, monitor progress, review reports         |
| Plan Creation        | Create and assign learning plans, set milestones                 |
| Communication        | Send recommendations, annotate student progress                  |
| Reporting            | Access mentor dashboard, view aggregated learner analytics       |

---

### 5.3 Administrator Role

**Description:** Platform operator with full system access and management capabilities.

| Permission Category  | Specific Actions                                                   |
|----------------------|--------------------------------------------------------------------|
| User Management      | Create, update, deactivate, and delete users and roles            |
| Content Management   | Publish courses, manage certifications, post jobs/internships     |
| AI Configuration     | Configure AI providers, models, prompts, and agent settings       |
| Analytics            | Access full platform analytics and usage reports                  |
| Moderation           | Review, approve, or remove feedback and user-generated content    |

---

## 6. Core Modules

NEXA AI is composed of 20 core modules, each designed as an independent, scalable unit:

| #  | Module                          | Primary Purpose                                          |
|----|---------------------------------|----------------------------------------------------------|
| 1  | Authentication & Authorization  | Secure user login, JWT, OAuth2, role-based access        |
| 2  | User Profile Management         | Profile creation, skills, goals, preferences             |
| 3  | AI Career Guidance              | Personalized career advice and direction                 |
| 4  | AI Multi-Agent System           | Specialized agents for each domain                       |
| 5  | Learning Management System      | Courses, modules, quizzes, progress tracking             |
| 6  | Resume Analyzer                 | AI-powered resume review and scoring                     |
| 7  | Resume Builder                  | Guided resume creation with templates                    |
| 8  | ATS Scoring                     | Applicant Tracking System compatibility analysis         |
| 9  | Skill Gap Analyzer              | Compare current skills to target role requirements       |
| 10 | Career Roadmap Generator        | Visual, step-by-step career development plans            |
| 11 | Coding Assistant                | Code practice, debugging, and explanations               |
| 12 | AI Interview Coach              | Mock interviews with real-time AI feedback               |
| 13 | Job & Internship Recommendations| Matched opportunities based on profile                   |
| 14 | Project Recommendation Engine   | Relevant project ideas that build portfolio value        |
| 15 | Certification Management        | Curated certifications with relevance scores             |
| 16 | Feedback & Rating System        | User feedback, ratings, and platform quality signals     |
| 17 | Notifications                   | In-app, email, and push notifications                    |
| 18 | Analytics Dashboard             | User and admin-level insights and reports                |
| 19 | Admin Panel                     | Full platform management interface                       |
| 20 | Dockerized Deployment           | Container-based, scalable production deployment          |

---

## 7. AI-First Design Principles

NEXA AI is designed around **specialized AI agents** rather than a single general-purpose chatbot. Each agent focuses on a specific domain and collaborates through an orchestration layer to produce personalized, context-aware responses.

### 7.1 Multi-Agent Architecture

The system uses **LangGraph** to orchestrate multiple specialized agents:

| Agent                  | Responsibility                                       |
|------------------------|------------------------------------------------------|
| Career Advisor Agent   | Career path recommendations and planning             |
| Resume Analyst Agent   | Resume parsing, scoring, and improvement feedback    |
| Learning Path Agent    | Personalized course and resource recommendations     |
| Skill Gap Agent        | Gap analysis against target job descriptions         |
| Interview Coach Agent  | Mock interviews, question generation, evaluation     |
| Coding Mentor Agent    | Code review, hints, and explanations                 |
| Job Matcher Agent      | Job and internship opportunity matching              |
| Orchestrator Agent     | Routes user queries to the correct specialist agent  |

### 7.2 Personalization Principles

- Every response is informed by the user's complete profile, goals, and history
- The AI memory system retains context across sessions
- Recommendations evolve as the user makes progress
- Feedback loops ensure continuous improvement of AI responses

### 7.3 Knowledge Base (RAG)

- RAG (Retrieval-Augmented Generation) grounds AI responses in verified, up-to-date knowledge
- Vector embeddings stored in **Qdrant** enable semantic search across career content
- Domain knowledge is continuously updated through admin-managed ingestion pipelines

---

## 8. High-Level Functional Flow

```
User Registration / Login
          │
          ▼
   Profile Completion
   (Skills, Goals, Experience)
          │
          ▼
   AI Profile Analysis
   (Strengths, Gaps, Preferences)
          │
          ▼
  Career Recommendation
  (Suggested Paths & Roles)
          │
          ▼
   Skill Gap Analysis
   (Current vs. Required Skills)
          │
          ▼
   Learning Roadmap
   (Curated Step-by-Step Plan)
          │
          ▼
  Course Recommendations
  (LMS + External Resources)
          │
          ▼
   Resume Analysis
   (AI Review + ATS Score)
          │
          ▼
 Interview Preparation
 (Mock Interviews + Feedback)
          │
          ▼
 Placement Readiness Score
 (Composite AI Assessment)
          │
          ▼
Job & Internship Recommendations
(Matched Opportunities)
          │
          ▼
  Continuous AI Mentoring
  (Ongoing, Adaptive Guidance)
```

---

## 9. Success Criteria

The project will be considered successful if it can:

| Criterion               | Description                                                          |
|-------------------------|----------------------------------------------------------------------|
| Personalized Guidance   | AI mentor delivers career recommendations tailored to each user     |
| Accurate Roadmaps       | Roadmaps reflect real-world skill requirements for target roles     |
| Effective Resume Review | Resume feedback is specific, actionable, and ATS-aware              |
| Rich Recommendations    | Courses, projects, and certifications are relevant and ranked       |
| Interview Support       | Mock interviews provide realistic questions with quality feedback   |
| Secure Authentication   | All user data is protected; role-based access is enforced           |
| Scalable Deployment     | Platform runs reliably in Docker containers across environments     |
| Actionable Analytics    | Dashboards provide meaningful insights for all user roles           |

---

## 10. Expected Outcomes

At the completion of the project, NEXA AI will deliver:

1. **An AI mentor that understands each user's profile** — remembers goals, tracks progress, and adapts recommendations over time

2. **Personalized recommendations that improve over time** — the system learns from user interactions and feedback to refine its guidance

3. **Integrated learning and placement preparation** — a single platform covering everything from skill development to job applications

4. **A scalable, maintainable architecture** — Docker-based deployment suitable for production use and future feature additions

5. **A strong portfolio project** — demonstrating mastery of modern software engineering, AI integration, and enterprise-grade system design

---

## 11. Phase Roadmap

| Phase | Document                                 | Status      |
|-------|------------------------------------------|-------------|
| 1     | Software Requirement Specification (SRS) | ✅ Complete  |
| 2     | Functional Requirements                  | ⏳ Next      |
| 3     | Non-Functional Requirements              | ⏳ Pending   |
| 4     | System Architecture                      | ⏳ Pending   |
| 5     | Technology Stack                         | ⏳ Pending   |
| 6     | Database Design (MongoDB)                | ⏳ Pending   |
| 7     | Backend Architecture (FastAPI)           | ⏳ Pending   |
| 8     | Frontend Architecture (React + Vite)     | ⏳ Pending   |
| 9     | Authentication & Authorization           | ⏳ Pending   |
| 10    | AI Multi-Agent System                    | ⏳ Pending   |
| 11    | LangGraph Orchestrator                   | ⏳ Pending   |
| 12    | AI Memory & Personalization              | ⏳ Pending   |
| 13    | RAG Knowledge Base                       | ⏳ Pending   |
| 14    | Career Recommendation Engine             | ⏳ Pending   |
| 15    | Resume Analyzer                          | ⏳ Pending   |
| 16    | Interview Coach                          | ⏳ Pending   |
| 17    | Coding Assistant                         | ⏳ Pending   |
| 18    | LMS                                      | ⏳ Pending   |
| 19    | Feedback System                          | ⏳ Pending   |
| 20    | Notification System                      | ⏳ Pending   |
| 21    | Analytics Dashboard                      | ⏳ Pending   |
| 22    | Admin Panel                              | ⏳ Pending   |
| 23    | Docker Architecture                      | ⏳ Pending   |
| 24    | CI/CD Pipeline                           | ⏳ Pending   |
| 25    | Monitoring & Logging                     | ⏳ Pending   |
| 26    | Security                                 | ⏳ Pending   |
| 27    | Testing                                  | ⏳ Pending   |
| 28    | Deployment                               | ⏳ Pending   |
| 29    | Future Enhancements                      | ⏳ Pending   |
| 30    | Final Project Report & Viva Preparation  | ⏳ Pending   |

---

*NEXA AI SRS — Phase 1 of 30 | Version 1.0 | July 2026*
*Next: Phase 2 — Functional Requirements (150+ requirements)*
