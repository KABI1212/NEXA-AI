# NEXA AI — Functional Requirements Specification (FRS)
## Enterprise AI-Based Career Guidance and Learning Platform

---

| Field             | Details                                      |
|-------------------|----------------------------------------------|
| **Document**      | Functional Requirements Specification (FRS) |
| **Phase**         | 2 of 30                                      |
| **Version**       | 1.0                                          |
| **Project**       | NEXA AI                                      |
| **Project Type**  | Major Placement Project                      |
| **Date**          | July 2026                                    |
| **Status**        | ✅ Complete                                  |

---

## Table of Contents

1. [Functional Overview](#1-functional-overview)
2. [User Management Module](#2-user-management-module)
3. [Profile Management](#3-profile-management)
4. [Dashboard](#4-dashboard)
5. [AI Career Guidance](#5-ai-career-guidance)
6. [Resume Module](#6-resume-module)
7. [Skill Gap Analysis](#7-skill-gap-analysis)
8. [AI Roadmap](#8-ai-roadmap)
9. [Learning Management System](#9-learning-management-system)
10. [Coding Assistant](#10-coding-assistant)
11. [Interview Coach](#11-interview-coach)
12. [Job Recommendation](#12-job-recommendation)
13. [Recommendation Engine](#13-recommendation-engine)
14. [AI Agents](#14-ai-agents)
15. [AI Feedback System](#15-ai-feedback-system)
16. [Notification Module](#16-notification-module)
17. [Analytics](#17-analytics)
18. [Search](#18-search)
19. [Reports](#19-reports)
20. [Admin Module](#20-admin-module)
21. [Error Handling Requirements](#21-error-handling-requirements)
22. [Audit and Activity Logs](#22-audit-and-activity-logs)
23. [Requirements Summary](#23-requirements-summary)

---

## 1. Functional Overview

NEXA AI is organized into the following top-level modules. Every feature in the system falls within one of these domains.

```
NEXA AI
│
├── Authentication
├── User Profile
├── Student Dashboard
├── Mentor Dashboard
├── Admin Dashboard
├── AI Career Guidance
├── AI Multi-Agent System
├── Resume Analyzer
├── Resume Builder
├── ATS Analyzer
├── Learning Management System
├── Coding Assistant
├── Interview Coach
├── Job Recommendation
├── Internship Recommendation
├── Skill Gap Analysis
├── Roadmap Generator
├── AI Feedback System
├── Notifications
├── Analytics
├── Reports
└── Settings
```

---

## 2. User Management Module

### FR-001 — User Registration

**Description:** The system shall allow new users to create an account through multiple registration methods.

**Supported Registration Methods:**

| Method      | Status          |
|-------------|-----------------|
| Email       | ✅ Supported    |
| Google      | ✅ Supported    |
| GitHub      | ✅ Supported    |
| Microsoft   | ✅ Supported    |
| LinkedIn    | 🔮 Future       |

**Required Fields (Email Registration):**

| Field            | Type     | Validation                        |
|------------------|----------|-----------------------------------|
| First Name       | Text     | Required, 2–50 chars              |
| Last Name        | Text     | Required, 2–50 chars              |
| Email            | Email    | Required, unique, valid format    |
| Password         | Password | Min 8 chars, upper + lower + digit|
| Confirm Password | Password | Must match Password               |
| Accept Terms     | Checkbox | Must be checked                   |

**Validation Rules:**
- Email must be unique across all accounts
- Password must meet complexity policy
- Email verification link sent on successful registration
- Social login accounts auto-verified

**Post-Registration Actions:**
- Send welcome email with verification link
- Create default user profile record
- Assign default role: `Student`
- Redirect to onboarding flow

---

### FR-002 — User Login

**Description:** The system shall allow registered users to authenticate and access the platform.

**Supported Login Methods:**

| Method       | Mechanism                     |
|--------------|-------------------------------|
| Email + Password | Credential validation    |
| Google       | OAuth2 / OpenID Connect       |
| GitHub       | OAuth2                        |

**Session Features:**

| Feature         | Description                                   |
|-----------------|-----------------------------------------------|
| JWT Auth        | Access token issued on successful login       |
| Refresh Token   | Long-lived token to renew access tokens       |
| Remember Me     | Extends session duration (30 days)            |
| Device Tracking | Records device type, browser, IP, timestamp   |

**Security Rules:**
- Account locked after 5 consecutive failed attempts
- Lock duration: 15 minutes (auto-unlock)
- Suspicious login alerts via email
- All tokens cryptographically signed (RS256)

---

### FR-003 — Forgot Password / Password Reset

**Description:** The system shall provide a secure password recovery flow.

**Flow:**

```
Step 1 — User enters registered email
          │
          ▼
Step 2 — System sends OTP to email (6-digit, valid 10 min)
          │
          ▼
Step 3 — User enters OTP to verify identity
          │
          ▼
Step 4 — User sets new password (policy enforced)
          │
          ▼
Step 5 — Confirmation message + all sessions invalidated
```

**Rules:**
- OTP expires after 10 minutes
- Maximum 3 OTP attempts per session
- New password cannot be the same as the last 3 passwords
- All existing sessions are invalidated on password change

---

### FR-004 — User Roles and Permissions

**Description:** The system shall enforce a role-based access control (RBAC) model with four distinct roles.

| Role        | Description                                          |
|-------------|------------------------------------------------------|
| Student     | Primary learner — accesses all career guidance features |
| Mentor      | Guides assigned students, monitors progress          |
| Admin       | Manages platform content, users, and configurations  |
| Super Admin | Full system access including infrastructure settings |

**Role Assignment Rules:**
- Default role on registration: `Student`
- Role changes must be performed by Admin or Super Admin
- A user may hold only one role at a time
- Super Admin accounts are created through CLI/seed scripts only

---

### FR-005 — Session Management

**Description:** Users shall be able to view and manage all active sessions across devices.

**Capabilities:**

| Action                  | Description                                        |
|-------------------------|----------------------------------------------------|
| View Active Sessions    | List all devices with login time and location      |
| Logout Specific Device  | Revoke session token for one device                |
| Logout All Devices      | Invalidate all active tokens simultaneously        |
| Auto-Expire Sessions    | Sessions expire after 24h idle (configurable)     |

---

## 3. Profile Management

### FR-006 — Personal Information

**Description:** Users shall be able to manage their personal details through the profile module.

**Fields:**

| Field           | Type     | Required | Notes                          |
|-----------------|----------|----------|--------------------------------|
| First Name      | Text     | Yes      | Pre-filled from registration   |
| Last Name       | Text     | Yes      | Pre-filled from registration   |
| Gender          | Select   | No       | Male / Female / Prefer not to say |
| Date of Birth   | Date     | No       | Used for age-appropriate suggestions |
| Phone           | Tel      | No       | With country code              |
| Address         | Text     | No       | Free text                      |
| Country         | Select   | Yes      | Drives job/opportunity filters |
| State           | Select   | No       | Dynamic based on country       |
| City            | Text     | No       |                                |
| Profile Picture | Image    | No       | Max 2MB, JPEG/PNG              |
| Bio             | Textarea | No       | Max 500 chars                  |

---

### FR-007 — Academic Information

**Description:** Users shall provide their educational background to enable accurate career and skill recommendations.

**Fields:**

| Field         | Type   | Required | Notes                             |
|---------------|--------|----------|-----------------------------------|
| College       | Text   | Yes      | Autocomplete from database        |
| University    | Text   | No       | Affiliated university             |
| Degree        | Select | Yes      | B.Tech / M.Tech / BCA / MCA etc.  |
| Department    | Select | Yes      | CS / IT / ECE / Mechanical etc.   |
| Semester      | Select | No       | 1st – 8th                        |
| CGPA          | Number | No       | Scale 0–10, 2 decimal places      |
| Passing Year  | Year   | Yes      | Past or upcoming graduation year |

---

### FR-008 — Skills Management

**Description:** Users shall be able to build and maintain a skill profile with proficiency levels.

**Operations:**

| Action         | Description                                      |
|----------------|--------------------------------------------------|
| Add Skill      | Search and select from skill catalog             |
| Remove Skill   | Delete a skill from the profile                  |
| Update Level   | Set proficiency: Beginner / Intermediate / Advanced |

**Example Profile:**

| Skill    | Level        |
|----------|--------------|
| Java     | Intermediate |
| Python   | Beginner     |
| MongoDB  | Advanced     |
| React    | Intermediate |

**Rules:**
- Skill catalog sourced from a curated master list
- Users may also add custom skills not in the catalog
- Skill levels are used as input for Gap Analysis and Roadmap modules

---

### FR-009 — Interests

**Description:** Users shall select their areas of interest to guide AI recommendations.

**Available Interest Categories:**

| Interest         |
|------------------|
| Artificial Intelligence |
| Machine Learning |
| Cloud Computing  |
| Web Development  |
| Cyber Security   |
| Data Science     |
| Blockchain       |
| DevOps           |
| Mobile Development |
| Game Development |

**Rules:**
- Multiple selections allowed
- Minimum 1 interest required to activate AI recommendations
- Interests drive Career Prediction and Course Recommendation engines

---

### FR-010 — Career Goal

**Description:** Users shall specify their primary career goal to enable targeted guidance.

**Example Goals:**

| Goal              |
|-------------------|
| AI Engineer       |
| Software Engineer |
| Data Scientist    |
| Cloud Engineer    |
| DevOps Engineer   |
| Full Stack Developer |
| ML Engineer       |
| Cyber Security Analyst |

**Rules:**
- Users may specify up to 3 career goals ranked by priority
- Primary goal drives roadmap generation
- Goals can be updated at any time; AI adapts dynamically

---

## 4. Dashboard

### FR-011 — Dashboard Widgets

**Description:** The student dashboard shall present a unified overview of the user's progress and activities.

**Widgets:**

| Widget                 | Description                                                |
|------------------------|------------------------------------------------------------|
| Profile Completion     | % complete with missing fields highlighted                 |
| Current Roadmap        | Active phase and next milestone                           |
| Learning Progress      | Courses in progress with % completion                     |
| Skill Score            | Aggregate proficiency score across all skills             |
| Resume Score           | Latest ATS score with change trend                        |
| Placement Score        | Composite readiness score (AI-generated)                  |
| Upcoming Interviews    | Scheduled mock interview sessions                         |
| Recent Chats           | Last 3 AI conversations with quick-resume links           |
| Certificates           | Recently earned certificates                              |
| Notifications          | Unread platform notifications                             |

---

### FR-012 — AI Daily Suggestions

**Description:** The AI shall generate a personalized daily task plan for each user.

**Example Daily Suggestion:**

```
Today's Goal — July 3, 2026

1. Complete Java Collections module (est. 45 min)
2. Practice 5 LeetCode-style coding problems
3. Update Resume with latest project
4. Review AI/ML flashcards (10 min)
```

**Rules:**
- Suggestions generated fresh each day
- Based on: current roadmap, pending tasks, upcoming goals
- User may mark suggestions as done, skip, or defer
- Deferred tasks carry forward to the next day

---

## 5. AI Career Guidance

### FR-013 — AI Chat Interface

**Description:** The system shall provide a conversational AI interface where users can ask career-related questions in natural language.

**Sample Queries:**

| Query Type         | Example                                        |
|--------------------|------------------------------------------------|
| Career Fit         | "What career suits me based on my profile?"   |
| Skill Advice       | "Should I learn Java or Python first?"        |
| AI Careers         | "Should I go into AI or Cloud Computing?"     |
| Role Feasibility   | "Can I become a Data Scientist?"              |
| Market Trends      | "What is the future of Cloud Computing?"      |
| Salary Info        | "What is the average salary of an AI Engineer?"|

**Interface Requirements:**
- Markdown rendering for AI responses
- Code block syntax highlighting for technical answers
- Conversation history persisted across sessions
- Users may share or bookmark specific AI responses
- Chat sessions associated with user profile for personalization

---

### FR-014 — Personalized AI Responses

**Description:** The AI shall tailor every response using the user's full profile context.

**Context Sources Used by AI:**

| Source             | Data Used                                         |
|--------------------|---------------------------------------------------|
| Profile            | Skills, education, experience, location           |
| Resume             | Parsed content, ATS score                         |
| Skills             | Current level per skill                           |
| Learning Progress  | Completed and in-progress courses                 |
| Chat History       | Prior conversation context (last N turns)         |
| Career Goal        | Primary and secondary career targets              |

**Rules:**
- Context window managed by LangGraph memory module
- Responses must acknowledge user's current level (not generic)
- AI must cite limitations when information is uncertain

---

### FR-015 — Career Prediction

**Description:** The AI shall analyze the user's profile and predict best-fit career paths with supporting data.

**Output Format:**

| Field            | Description                                       |
|------------------|---------------------------------------------------|
| Career           | Recommended career title (e.g., "ML Engineer")   |
| Match %          | Compatibility score based on profile alignment   |
| Reason           | Explanation of why this career fits              |
| Learning Time    | Estimated time to job-readiness                  |
| Expected Salary  | Market salary range for this role                |
| Growth           | Industry demand and growth trend                 |
| Risk             | Assessed difficulty or competitive risk          |
| Recommendation   | Next action steps                                |

---

## 6. Resume Module

### FR-016 — Resume Upload

**Description:** Users shall be able to upload their existing resume for AI analysis.

**Supported Formats:**

| Format | Max Size |
|--------|----------|
| PDF    | 5 MB     |
| DOCX   | 5 MB     |

**Rules:**
- File validated for type and size before upload
- Uploaded resumes stored securely in cloud storage (S3/GCS)
- Multiple versions can be stored; latest is marked as primary
- Upload triggers automatic parsing and analysis pipeline

---

### FR-017 — Resume Parsing

**Description:** The system shall extract structured information from uploaded resumes.

**Extracted Fields:**

| Field          | Examples                                   |
|----------------|--------------------------------------------|
| Skills         | Python, React, MongoDB                     |
| Education      | Degree, Institution, Year, CGPA            |
| Experience     | Company, Role, Duration, Responsibilities  |
| Projects       | Name, Tech Stack, Description              |
| Certificates   | Name, Issuer, Date                         |
| Achievements   | Awards, Hackathons, Publications           |

**Rules:**
- Parsing powered by NLP/LLM pipeline
- Parsed data merged into user profile (with user confirmation)
- Parsing result shown to user for review and correction

---

### FR-018 — ATS Analysis

**Description:** The system shall evaluate the resume against Applicant Tracking System standards.

**Output:**

| Field              | Description                                          |
|--------------------|------------------------------------------------------|
| ATS Score          | 0–100 overall compatibility score                    |
| Missing Keywords   | Important keywords absent for target role            |
| Weak Sections      | Sections with insufficient content or clarity        |
| Formatting Issues  | Layout problems that ATS systems may reject         |
| Grammar            | Grammatical issues and suggested corrections         |
| Suggestions        | Ranked list of improvements to boost ATS score      |

---

### FR-019 — Resume Builder

**Description:** The system shall provide a guided resume creation tool for users who do not have an existing resume.

**Resume Types:**

| Type              | Target User                    |
|-------------------|-------------------------------|
| Freshers Resume   | Students with no experience   |
| Experienced Resume| Working professionals         |
| Research Resume   | Academic / PhD applicants     |
| Internship Resume | Students seeking internships  |

**Features:**
- Multiple professional templates
- Section-by-section guided input
- Real-time ATS score preview as user builds resume
- Export to PDF or DOCX
- Auto-populate from user profile data

---

## 7. Skill Gap Analysis

### FR-020 — Skill Comparison

**Description:** The system shall compare the user's current skill set against the requirements of a target job role.

**Flow:**

```
User's Current Skills
        │
        ▼
  Target Job Selected
  (e.g., ML Engineer at Google)
        │
        ▼
  Gap Analysis Engine
        │
        ▼
  Missing Skills Identified
  with Priority Scores
```

**Output:**

| Category         | Details                                         |
|------------------|-------------------------------------------------|
| Matched Skills   | Skills the user already has for this role       |
| Missing Skills   | Skills required but not present in profile      |
| Partial Skills   | Skills present but at insufficient level        |
| Match %          | Overall readiness percentage                    |

---

### FR-021 — Learning Recommendation

**Description:** Based on the skill gap, the system shall recommend a structured remediation plan.

**Output:**

| Field               | Description                                     |
|---------------------|-------------------------------------------------|
| Priority            | High / Medium / Low for each missing skill      |
| Courses             | Specific courses to learn each skill            |
| Projects            | Hands-on projects to reinforce the skill        |
| Certificates        | Certifications that validate the skill          |
| Estimated Duration  | Time to close each skill gap                    |

---

## 8. AI Roadmap

### FR-022 — Dynamic Roadmap Generation

**Description:** The AI shall generate a complete, time-bound learning roadmap based on the user's career goal, skill level, and available study time.

**Roadmap Structure:**

```
Career Goal: AI Engineer
│
├── Month 1 — Python & Math Foundations
│   ├── Week 1 — Python Basics
│   ├── Week 2 — Python OOP
│   ├── Week 3 — NumPy & Pandas
│   └── Week 4 — Statistics for ML
│
├── Month 2 — Machine Learning Core
│   ├── Week 1 — Supervised Learning
│   ├── Week 2 — Unsupervised Learning
│   ├── Week 3 — Model Evaluation
│   └── Week 4 — Scikit-Learn Projects
│
└── Month 3 — Deep Learning & Deployment
    ├── Week 1 — Neural Networks
    ├── Week 2 — TensorFlow / PyTorch
    ├── Week 3 — Model Deployment (FastAPI)
    └── Week 4 — Capstone Project
```

**Rules:**
- Roadmap adapts dynamically as user completes tasks
- Blocked tasks unlock after prerequisites are complete
- Roadmap can be regenerated if career goal changes

---

### FR-023 — Progress Tracking

**Description:** The system shall track and display the user's progress against their roadmap.

**Task States:**

| State     | Description                                      |
|-----------|--------------------------------------------------|
| Completed | User marked task as done                         |
| Pending   | Not yet started                                  |
| Overdue   | Deadline passed without completion               |
| Skipped   | User explicitly skipped the task                 |

**Metrics Tracked:**
- Overall roadmap completion percentage
- On-time completion rate
- Streak (consecutive days of progress)
- Time spent per task

---

## 9. Learning Management System

### FR-024 — Course Content Types

**Description:** The LMS shall support multiple content delivery formats within a single course.

**Supported Content Types:**

| Type         | Description                                      |
|--------------|--------------------------------------------------|
| Video        | Embedded or streamed video lessons               |
| PDF          | Downloadable reading materials                   |
| Articles      | In-platform rich text content                   |
| Assignments  | Submitted tasks with instructor grading          |
| Quiz         | Multiple choice and short answer assessments     |
| Coding Lab   | In-browser code editor with test cases           |

---

### FR-025 — Learning Progress Tracking

**Description:** The system shall record detailed progress data for every learner.

**Tracked Metrics:**

| Metric          | Description                                    |
|-----------------|------------------------------------------------|
| Watch %         | Video completion percentage                    |
| Completion %    | Overall course progress                        |
| Quiz Score      | Score per quiz attempt with history            |
| Time Spent      | Cumulative time on the course                  |
| Last Accessed   | Timestamp for resuming from last position      |

---

### FR-026 — Certificates

**Description:** The system shall issue verifiable digital certificates upon course completion.

**Certificate Properties:**

| Property           | Description                                     |
|--------------------|-------------------------------------------------|
| Format             | PDF, shareable link                             |
| QR Code            | Embedded QR for instant online verification    |
| Certificate ID     | Unique alphanumeric identifier                  |
| Expiry             | Optional expiry date for time-limited certs    |
| Verification URL   | Public URL accessible without login            |

---

## 10. Coding Assistant

### FR-027 — Supported Languages

**Description:** The coding assistant shall support practice and assistance in the following programming languages.

| Language    | Features Supported                                    |
|-------------|-------------------------------------------------------|
| Python      | Full — explain, debug, generate, optimize, run        |
| Java        | Full — explain, debug, generate, optimize             |
| C           | Explain, debug, generate                             |
| C++         | Explain, debug, generate                             |
| JavaScript  | Full — explain, debug, generate, optimize, run       |
| SQL         | Query explain, optimize, generate                    |

---

### FR-028 — Coding Assistant Features

**Description:** The coding assistant shall offer the following capabilities for each supported language.

| Feature              | Description                                            |
|----------------------|--------------------------------------------------------|
| Explain Code         | Line-by-line or block-level explanation in plain English |
| Debug                | Identify bugs and provide corrected code               |
| Generate Code        | Generate code from natural language description        |
| Optimize             | Suggest performance or readability improvements        |
| Complexity Analysis  | Time and space complexity calculation                  |
| Dry Run              | Step-by-step execution trace with variable states      |
| Interview Questions  | Generate relevant interview questions from the code    |

---

## 11. Interview Coach

### FR-029 — Mock Interview Modes

**Description:** The system shall support four distinct mock interview formats to prepare users for different interview stages.

| Mode        | Description                                               |
|-------------|-----------------------------------------------------------|
| HR          | Behavioral and situational questions                      |
| Technical   | Role-specific technical questions                        |
| Behavioral  | STAR-method structured behavioral assessment             |
| Coding      | Live coding problem with AI evaluator                    |

**Interview Flow:**
- User selects mode and target role
- AI generates contextually relevant questions
- User responds via text or voice (voice: future)
- AI evaluates response in real-time
- Full report generated at session end

---

### FR-030 — Interview Performance Report

**Description:** The system shall generate a detailed post-interview report for each mock session.

**Report Metrics:**

| Metric            | Description                                          |
|-------------------|------------------------------------------------------|
| Confidence        | Assessed from response length and structure          |
| Accuracy          | Correctness of technical answers                     |
| Grammar           | Grammatical correctness and professional tone        |
| Communication     | Clarity, structure, and conciseness                  |
| Technical Score   | Domain-specific knowledge score                      |
| Overall Score     | Weighted composite of all metrics                    |

**Additional Report Features:**
- Sample ideal answers for each question
- Specific improvement areas highlighted
- Comparison with previous interview attempts
- Exportable as PDF

---

## 12. Job Recommendation

### FR-031 — AI Job Matching

**Description:** The system shall recommend career opportunities tailored to the user's profile.

**Opportunity Types:**

| Type          | Description                                      |
|---------------|--------------------------------------------------|
| Jobs          | Full-time employment positions                   |
| Internships   | Part-time or full-time internship roles          |
| Remote Jobs   | Location-independent opportunities              |
| Freelancing   | Project-based work opportunities                |
| Hackathons    | Coding competitions and challenge events         |

---

### FR-032 — Job Match Score

**Description:** Each recommended opportunity shall include a detailed compatibility breakdown.

**Match Card Format:**

| Field          | Description                                       |
|----------------|---------------------------------------------------|
| Company        | Employer name and logo                            |
| Job Role       | Position title                                    |
| Match %        | AI-calculated compatibility percentage           |
| Missing Skills | Skills user lacks for this role                  |
| Salary Range   | Estimated or posted compensation range           |
| Apply Link     | Direct link to application or job posting        |

---

## 13. Recommendation Engine

**Description:** The AI recommendation engine shall proactively suggest resources and opportunities across all domains.

| Category      | What is Recommended                                  |
|---------------|------------------------------------------------------|
| Courses       | LMS courses and external platforms (Coursera, Udemy) |
| Books         | Technical books relevant to career goal              |
| Projects      | Hands-on project ideas with tech stack suggestions   |
| Certificates  | Industry-recognized certifications with priority rank|
| Communities   | Online communities, GitHub orgs, Discord servers     |
| Mentors       | Suggested mentor profiles based on user's goal       |

**Rules:**
- All recommendations ranked by relevance to user's current goal and skill level
- Recommendations updated weekly or when profile changes
- Users can mark recommendations as "Not Interested" to refine future suggestions

---

## 14. AI Agents

**Description:** The platform shall implement a multi-agent AI architecture where each agent is specialized for a specific domain. Agents communicate through the LangGraph orchestration layer.

| #  | Agent Name            | Primary Responsibility                              |
|----|-----------------------|-----------------------------------------------------|
| 1  | Career Agent          | Career path analysis and recommendations            |
| 2  | Resume Agent          | Resume parsing, scoring, and improvement suggestions|
| 3  | ATS Agent             | ATS score calculation and keyword optimization      |
| 4  | Learning Agent        | Course and resource recommendations                 |
| 5  | Coding Agent          | Code explanation, debugging, and generation         |
| 6  | Interview Agent       | Mock interview conduct and evaluation               |
| 7  | Recommendation Agent  | Cross-domain resource and opportunity recommendations|
| 8  | Skill Gap Agent       | Skill comparison and gap identification             |
| 9  | Roadmap Agent         | Dynamic roadmap generation and adaptation           |
| 10 | Job Agent             | Job matching and application guidance               |
| 11 | Internship Agent      | Internship matching and outreach assistance         |
| 12 | Feedback Agent        | Collecting, processing, and routing user feedback   |
| 13 | Mentor Agent          | Connecting users with mentors, surfacing insights   |
| 14 | Analytics Agent       | Generating insights from user progress data         |
| 15 | Notification Agent    | Triggering and routing platform notifications       |
| 16 | Admin Agent           | Automated admin reporting and alert generation      |

**Orchestration Rules:**
- User queries are received by the Orchestrator
- Orchestrator routes to one or more specialist agents
- Agents share a common memory context per user session
- Fallback logic handles agent unavailability gracefully

---

## 15. AI Feedback System

### FR-033 — Quick Feedback

**Description:** After every AI response, the system shall solicit a quick helpfulness rating.

**Interface:**

```
Was this response helpful?

  👍 Helpful        👎 Not Helpful
```

**Rules:**
- Feedback recorded with: response ID, user ID, timestamp, rating
- Not disruptive — appears inline below each response
- Required for model fine-tuning and quality monitoring

---

### FR-034 — Detailed Feedback Rating

**Description:** Users shall optionally provide a detailed rating across multiple quality dimensions.

**Rating Dimensions (1–5 stars each):**

| Dimension     | What It Measures                               |
|---------------|------------------------------------------------|
| Accuracy      | Was the information correct?                   |
| Helpfulness   | Did it solve the user's problem?               |
| Clarity       | Was the response easy to understand?           |
| Speed         | Was the response delivered quickly?            |
| Completeness  | Did the response fully address the question?   |

---

### FR-035 — Feedback Categories

**Description:** When rating negatively, users shall select a category explaining the issue.

**Categories:**

| Category     | Description                                     |
|--------------|-------------------------------------------------|
| Incorrect    | The information was factually wrong             |
| Incomplete   | The response was missing important information  |
| Outdated     | The information was not current                 |
| Too Long     | The response was unnecessarily verbose          |
| Not Helpful  | The response did not address the question       |
| Other        | Custom free-text feedback                       |

---

## 16. Notification Module

**Description:** The system shall deliver timely notifications to users through multiple channels.

**Supported Channels:**

| Channel      | Status         |
|--------------|----------------|
| Email        | ✅ Supported   |
| Push (Browser/App) | ✅ Supported |
| In-App       | ✅ Supported   |
| SMS          | 🔮 Future      |

**Notification Events:**

| Event                  | Trigger                                           |
|------------------------|---------------------------------------------------|
| New Course Available   | When a new course matching user's interests is published |
| Interview Reminder     | 1 hour and 24 hours before scheduled mock interview |
| Roadmap Task Due       | When a roadmap task is approaching deadline       |
| Certificate Issued     | Upon course completion and cert generation        |
| Job Match Found        | When new jobs matching user profile are found     |
| Weekly Progress Report | Every Monday at 9:00 AM (user's timezone)        |
| Mentor Message         | When assigned mentor sends a recommendation       |
| Password Changed       | Security alert on account password change        |

**User Controls:**
- Per-event notification preferences settable in profile settings
- Global notification mute option
- Email digest option (daily or weekly summary)

---

## 17. Analytics

**Description:** The system shall provide role-specific analytics dashboards with meaningful progress and usage insights.

### Student Analytics

| Metric                 | Description                                          |
|------------------------|------------------------------------------------------|
| Learning Hours         | Total hours spent on platform learning               |
| Courses Completed      | Count and list of completed courses                  |
| Resume Score Trend     | ATS score over time (line chart)                     |
| Placement Readiness    | Composite readiness score over time                  |
| Skill Growth           | Skills added and proficiency levels over time        |
| Interview Performance  | Score trends across mock interview sessions          |

### Mentor Analytics

| Metric              | Description                                           |
|---------------------|-------------------------------------------------------|
| Assigned Students   | List of students with current status                 |
| Average Progress    | Mean roadmap completion across all assigned students |
| Completion Rate     | Percentage of students who completed assigned plans  |

### Admin Analytics

| Metric               | Description                                          |
|----------------------|------------------------------------------------------|
| Active Users         | Daily and monthly active user counts                 |
| Daily Logins         | Login volume trend over time                         |
| AI Usage             | Agent invocations by type and volume                 |
| Feedback Trends      | Positive vs. negative feedback ratio over time       |
| Course Popularity    | Most enrolled and highest-rated courses              |
| Placement Statistics | Students who reported successful placement           |

---

## 18. Search

### Global Search

**Description:** The system shall provide a unified search experience across all platform content.

**Searchable Entities:**

| Entity       | Fields Indexed                                   |
|--------------|--------------------------------------------------|
| Courses      | Title, description, tags, instructor             |
| Skills       | Skill name, category                             |
| Jobs         | Title, company, location, required skills        |
| Companies    | Name, industry, size                             |
| Projects     | Name, description, tech stack                    |
| Certificates | Name, issuer, domain                             |
| Mentors      | Name, expertise, industry                        |

**Search Features:**
- Full-text search with relevance ranking
- Filters by category, difficulty, and type
- Auto-suggestions and typo tolerance
- Search results personalized based on user profile

---

## 19. Reports

**Description:** The system shall allow users, mentors, and admins to generate downloadable reports.

**Export Formats:**

| Format | Use Case                              |
|--------|---------------------------------------|
| PDF    | Formal reports for sharing/printing  |
| Excel  | Data analysis and spreadsheet use    |
| CSV    | Raw data for third-party tools       |

**Available Reports:**

| Report Name         | Available To         | Contents                                    |
|---------------------|----------------------|---------------------------------------------|
| Placement Report    | Student, Admin       | Readiness score, skills, recommendations    |
| Learning Report     | Student, Mentor      | Course progress, quiz scores, time spent    |
| Resume Report       | Student              | ATS score, parse result, improvement plan   |
| Feedback Report     | Admin                | Feedback volume, categories, trends         |
| Analytics Report    | Admin                | Full platform usage and engagement data     |

---

## 20. Admin Module

**Description:** The administrator shall have access to a dedicated management interface covering all platform operations.

**Admin Capabilities:**

| Capability                    | Description                                         |
|-------------------------------|-----------------------------------------------------|
| User Management               | Create, view, update, deactivate, delete users     |
| Role Assignment               | Change user roles (Student / Mentor / Admin)       |
| Course Management             | Create, edit, publish, archive courses             |
| Job & Internship Management   | Post, edit, archive job and internship listings    |
| AI Configuration              | Set AI provider (OpenAI/Gemini), prompts, models   |
| Feedback Review               | View, filter, respond to, or remove user feedback  |
| Analytics Dashboard           | Full platform analytics access                     |
| Certificate Management        | View, revoke, reissue certificates                 |
| Announcements                 | Broadcast system-wide announcements                |
| System Settings               | Configure notification rules, session policies     |

---

## 21. Error Handling Requirements

**Description:** The system shall handle all error conditions gracefully without exposing technical details to end users.

**Rules:**

| Requirement                        | Description                                                    |
|------------------------------------|----------------------------------------------------------------|
| Input Validation                   | All form inputs validated client-side and server-side         |
| User-Friendly Messages             | All errors shown in plain English with actionable guidance    |
| AI Failure Retry                   | Transient AI provider failures retried up to 3 times         |
| Fallback AI Provider               | Secondary LLM activated when primary provider is unavailable  |
| Duplicate Submission Prevention    | All forms protected against double-submission                 |
| Token Expiry Handling              | Expired JWTs trigger silent refresh; if fails, redirect to login |
| Error Logging                      | All server errors logged to monitoring system with trace ID   |
| HTTP Status Codes                  | All API responses use correct HTTP status codes               |

---

## 22. Audit and Activity Logs

**Description:** The system shall maintain a tamper-resistant audit log of significant user and system actions.

**Logged Events:**

| Category        | Events Logged                                              |
|-----------------|------------------------------------------------------------|
| Authentication  | Login, logout, failed attempts, password changes          |
| Profile         | Profile updates, photo changes, role changes              |
| Resume          | Upload, delete, ATS analysis triggered                    |
| AI Interaction  | Session start/end, agent invocations (configurable)       |
| LMS             | Course enrollment, completion, certificate issuance       |
| Admin Actions   | User creation, role changes, course publish/archive       |
| Security Events | Suspicious login, account lock, token revocation          |

**Audit Log Properties:**
- Logs are append-only (immutable after creation)
- Each entry contains: timestamp, user ID, action, IP address, outcome
- Logs retained for minimum 12 months
- Accessible only to Admin and Super Admin roles
- Exportable as CSV for compliance reporting

---

## 23. Requirements Summary

### Requirement Registry

| FR ID  | Requirement Name              | Module              | Priority |
|--------|-------------------------------|---------------------|----------|
| FR-001 | User Registration             | Authentication      | Must     |
| FR-002 | User Login                    | Authentication      | Must     |
| FR-003 | Forgot Password               | Authentication      | Must     |
| FR-004 | User Roles                    | Authentication      | Must     |
| FR-005 | Session Management            | Authentication      | Should   |
| FR-006 | Personal Information          | Profile             | Must     |
| FR-007 | Academic Information          | Profile             | Must     |
| FR-008 | Skills Management             | Profile             | Must     |
| FR-009 | Interests                     | Profile             | Must     |
| FR-010 | Career Goal                   | Profile             | Must     |
| FR-011 | Dashboard Widgets             | Dashboard           | Must     |
| FR-012 | AI Daily Suggestions          | Dashboard           | Should   |
| FR-013 | AI Chat Interface             | AI Guidance         | Must     |
| FR-014 | Personalized AI Responses     | AI Guidance         | Must     |
| FR-015 | Career Prediction             | AI Guidance         | Must     |
| FR-016 | Resume Upload                 | Resume              | Must     |
| FR-017 | Resume Parsing                | Resume              | Must     |
| FR-018 | ATS Analysis                  | Resume              | Must     |
| FR-019 | Resume Builder                | Resume              | Should   |
| FR-020 | Skill Comparison              | Skill Gap           | Must     |
| FR-021 | Learning Recommendation       | Skill Gap           | Must     |
| FR-022 | Dynamic Roadmap               | Roadmap             | Must     |
| FR-023 | Progress Tracking             | Roadmap             | Must     |
| FR-024 | Course Content Types          | LMS                 | Must     |
| FR-025 | Learning Progress Tracking    | LMS                 | Must     |
| FR-026 | Certificates                  | LMS                 | Should   |
| FR-027 | Coding Languages              | Coding Assistant    | Must     |
| FR-028 | Coding Features               | Coding Assistant    | Must     |
| FR-029 | Mock Interview Modes          | Interview Coach     | Must     |
| FR-030 | Interview Report              | Interview Coach     | Must     |
| FR-031 | AI Job Matching               | Jobs                | Should   |
| FR-032 | Job Match Score               | Jobs                | Should   |
| FR-033 | Quick Feedback                | Feedback            | Must     |
| FR-034 | Detailed Feedback Rating      | Feedback            | Should   |
| FR-035 | Feedback Categories           | Feedback            | Should   |

### Priority Definitions

| Priority | Meaning                                                           |
|----------|-------------------------------------------------------------------|
| **Must** | Core requirement — system cannot launch without it              |
| **Should** | Important requirement — include in v1.0 if time permits        |
| **Could** | Nice-to-have — defer to v1.1 if needed                         |

---

> **Phase 2 Complete** — 35 formal functional requirements defined across 22 modules.
>
> **Next: Phase 3 — Non-Functional Requirements (NFR)**
> Covering performance, scalability, security, availability, monitoring, accessibility, AI-specific requirements, and compliance standards that define *how well* the system must operate.

---

*NEXA AI FRS — Phase 2 of 30 | Version 1.0 | July 2026*
