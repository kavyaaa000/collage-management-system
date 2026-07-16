# 🎓 Smart ERP — Web-Based Smart ERP Solution for Academic Institutions

> A full-stack, enterprise-grade ERP platform that automates admissions, administration, HOD management, timetable generation, examinations, AI-assisted evaluation, analytics, and student engagement through a modular, scalable architecture.

Smart ERP replaces fragmented, paper-driven academic administration with a single, secure, role-based web application — built the way production software is built, not the way a class project usually is.

---



## 📑 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Features](#-features)
- [Module Explanation](#-module-explanation)
  - [Admission Management](#1-admission-management-module)
  - [Administration](#2-administration-module)
  - [HOD Module](#3-hod-module)
  - [Connection Platform](#4-connection-platform)
  - [AI Evaluation](#5-ai-evaluation-module)
  - [Analytics](#6-analytics-module)
- [System Architecture](#-system-architecture)
- [Complete Workflow](#-complete-workflow)
- [UML Diagrams](#-uml-diagrams)
- [Technology Stack](#-technology-stack)
- [Backend Folder Structure](#-backend-folder-structure)
- [Frontend Folder Structure](#-frontend-folder-structure)
- [Database Overview](#-database-overview)
- [Authentication Flow](#-authentication-flow)
- [API Overview](#-api-overview)
- [Installation Guide](#-installation-guide)
- [Running the Project](#-running-the-project)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Learning Outcomes](#-learning-outcomes)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🧭 Overview

**Smart ERP** is a modular, web-based Enterprise Resource Planning system purpose-built for colleges and universities. It unifies the entire academic lifecycle — from a student's first admission application to their final performance analytics — into one secure, role-aware platform.

The system is engineered with production-grade practices: a layered Spring Boot backend, a strongly-typed React/TypeScript frontend, JWT-based stateless authentication, and an AI/automation layer for evaluation and scheduling. It is designed to be **maintainable, extensible, and demo-ready** for both academic evaluation and real-world deployment scenarios.

---

## ❗ Problem Statement

Most academic institutions still rely on a patchwork of manual registers, spreadsheets, disconnected portals, and email chains to manage:

- Admissions and document verification
- Faculty workload and timetable creation
- Examination correction and marks entry
- Student performance tracking

This leads to:

- ⏳ Slow, error-prone administrative cycles
- 📄 Excessive paperwork and duplicate data entry
- 🔍 Lack of transparency between students, staff, HODs, and admins
- 📉 No centralized analytics to identify at-risk students or high performers
- 🔐 Weak access control between different institutional roles

## 💡 Solution Overview

Smart ERP addresses these problems with a **single unified platform** that:

- Digitizes the entire admission pipeline with automated cutoff-based seat allocation
- Provides centralized CRUD-based administration for all institutional data
- Automates conflict-free timetable generation using constraint-based scheduling (Google OR-Tools CP-SAT)
- Runs a gamified assessment platform (quizzes, coding tests, coin rewards)
- Uses OCR + keyword/similarity matching to assist faculty in evaluating scanned answer sheets
- Delivers rich analytics dashboards for both faculty and students
- Enforces strict Role-Based Access Control (RBAC) secured by JWT

---

## ✨ Features

**🧾 Automated Admissions**
End-to-end online admission workflow with document verification, correction cycles, and automatic seat allocation based on cutoff and department preference.

**🗂️ Centralized Administration**
Full CRUD control over students, faculty, departments, subjects, academic records, roles, and permissions from one console.

**📅 Intelligent Timetabling**
HODs allocate workload and auto-generate conflict-free timetables using constraint-based scheduling, exportable to PDF/Excel.

**🎮 Gamified Assessments**
Admins, HODs, and staff create quizzes and coding tests with automatic evaluation, marks generation, and a coin-based reward economy.

**🤖 AI-Assisted Evaluation**
OCR extracts text from scanned answer sheets; keyword and similarity matching predicts marks, which faculty can review and override.

**📊 Actionable Analytics**
Faculty get risk-student detection, topper identification, and historical performance trends; students get personalized dashboards and improvement suggestions.

**🔐 Secure, Role-Based Access**
JWT-based authentication with strict RBAC across Admin, HOD, Staff, and Student roles.

**🧩 Modular Architecture**
Each domain (admissions, attendance, evaluation, connect, erp) is isolated into its own package/module for maintainability and independent scaling.

---

## 🧱 Module Explanation

### 1. Admission Management Module

**Purpose**
Digitize and automate the full student admission lifecycle, from application to seat confirmation.

**Workflow**
1. Admin opens the admission process.
2. Students register online and upload required documents.
3. The system auto-calculates cutoffs.
4. Admin closes admissions once the window ends.
5. Guide staff are assigned automatically or manually.
6. Staff verify uploaded documents.
7. If corrections are needed, staff request resubmission and the system emails the student automatically.
8. Students resubmit corrected documents.
9. Staff approve verified applications.
10. The system automatically allocates seats based on cutoff and department preference.
11. Admission results are published.
12. Students accept or reject their offer.

**Features**
- Online registration and document upload
- Automated cutoff calculation
- Manual or automatic guide-staff assignment
- Correction and resubmission workflow with email notifications
- Automated, preference-aware seat allocation
- Result publication and acceptance tracking

**Advantages**
- Eliminates manual paperwork and physical document handling
- Reduces admission processing time significantly
- Ensures fair, rule-based seat allocation
- Provides full transparency to applicants at every stage

---

### 2. Administration Module

**Purpose**
Give administrators a single control plane to manage all core institutional data.

**Workflow**
1. Admin logs in with elevated privileges.
2. Admin performs CRUD operations on students, faculty, departments, and subjects.
3. Admin manages academic records and institution-wide data.
4. Admin configures roles, permissions, and system settings.

**Features**
- Complete CRUD for students, faculty, departments, and subjects
- Academic record and institution data management
- Role and permission management
- Centralized system configuration

**Advantages**
- Removes dependency on scattered spreadsheets
- Provides a single source of truth for institutional data
- Enables fine-grained access control across the platform

---

### 3. HOD Module

**Purpose**
Empower department heads to manage faculty workload and generate optimized, conflict-free timetables.

**Workflow**
1. HOD reviews department faculty and subjects.
2. HOD allocates workload and assigns subjects to faculty.
3. HOD triggers automatic timetable generation.
4. The constraint-based scheduling engine resolves conflicts (faculty overlap, room clashes, subject hour limits).
5. HOD reviews and exports the finalized timetable.

**Features**
- Faculty workload allocation
- Faculty-subject assignment
- Automatic, constraint-based timetable generation
- Conflict-free scheduling engine
- Export to PDF and Excel
- Persisted storage of generated timetables

**Advantages**
- Eliminates hours of manual timetable drafting
- Guarantees zero scheduling conflicts
- Provides exportable, shareable schedules for staff and students

---

### 4. Connection Platform

**Purpose**
A gamified assessment ecosystem connecting admins, HODs, staff, and students through quizzes, coding tests, and rewards.

**Workflow**
1. Admin creates global quizzes; HODs create departmental quizzes; staff create coding tests.
2. Students attempt MCQ or coding assessments.
3. The system automatically evaluates coding submissions by running and checking outputs.
4. Marks are generated and coins are awarded based on performance.
5. Students redeem coins for rewards; special rewards require HOD approval.

**Features**
- Global, departmental, and staff-level assessments
- MCQ and coding-based assessments
- Automated output evaluation for code submissions
- Coin-based reward system with redemption flow
- HOD-approval gate for special rewards

**Advantages**
- Increases student engagement through gamification
- Reduces manual grading effort for objective assessments
- Encourages healthy academic competition

---

### 5. AI Evaluation Module

**Purpose**
Assist faculty in grading handwritten answer sheets using OCR and NLP-based techniques, without removing human judgment from the process.

**Workflow**
1. Faculty uploads a scanned answer sheet (PDF).
2. OCR extracts the handwritten/typed text.
3. The system performs keyword matching and similarity checking against model answers.
4. Marks are automatically predicted and displayed on a prediction dashboard.
5. Faculty reviews the predicted marks and can override them.
6. Final marks are stored in the database.

**Features**
- PDF upload and OCR-based text extraction
- Keyword matching and similarity scoring
- Automatic mark prediction with a review dashboard
- Faculty override capability before finalization

**Advantages**
- Drastically reduces manual correction time
- Keeps faculty in full control of final grading decisions
- Provides consistent, bias-reduced first-pass evaluation

---

### 6. Analytics Module

**Purpose**
Convert raw academic data into actionable insight for both faculty and students.

**Workflow**
1. The system aggregates historical performance data across exams and assessments.
2. Faculty-facing dashboards highlight risk students, toppers, and comparative trends.
3. Student-facing dashboards show personal performance, class comparisons, and improvement tips.

**Features (Faculty)**
- Historical student analysis
- Performance comparison across cohorts
- Risk-student detection
- Topper identification
- Performance charts and student profiling

**Features (Students)**
- Personal performance dashboard
- Historical self-analysis
- Comparison with classmates
- Notifications and improvement suggestions

**Advantages**
- Enables early intervention for at-risk students
- Gives students visibility into their own academic trajectory
- Supports data-driven decision-making for faculty and HODs

---

## 🏗️ System Architecture



Smart ERP follows a **layered, modular monolith** architecture on the backend paired with a **component-driven SPA** on the frontend:

- **Presentation Layer** — React + TypeScript SPA consuming REST APIs via Axios, with route-based access control via React Router.
- **API Layer** — Spring Boot REST controllers exposing versioned endpoints per module (admissions, attendance, evaluation, connect, erp).
- **Security Layer** — Spring Security + JWT filter chain validating tokens and enforcing RBAC before requests reach business logic.
- **Service Layer** — Encapsulates business rules (cutoff calculation, seat allocation, scheduling, evaluation logic).
- **Persistence Layer** — Spring Data JPA/Hibernate repositories mapping entities to MySQL tables.
- **AI/Automation Layer** — Python-based OCR, keyword-matching, and Google OR-Tools CP-SAT scheduling services, invoked from the backend for evaluation and timetable generation.

Each domain module (`admissions`, `attendance`, `connect`, `evaluation`, `erp`) is self-contained with its own controller/service/repository/entity/DTO structure, keeping the codebase loosely coupled and independently testable.

---

## 🔄 Complete Workflow



The end-to-end institutional flow: **Admission → Administration → HOD Scheduling → Assessments (Connect) → AI Evaluation → Analytics**, with every stage feeding data into the centralized MySQL database and surfacing insights back to students, faculty, HODs, and admins in real time.

---


---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React.js | Component-based UI library |
| TypeScript | Static typing for scalable frontend code |
| Material UI | Prebuilt, accessible UI components |
| Axios | HTTP client for REST API communication |
| React Router | Client-side routing and navigation |
| HTML | Markup structure |
| CSS | Styling |

### Backend

| Technology | Purpose |
|---|---|
| Java | Core backend language |
| Spring Boot | Application framework and dependency injection |
| Spring Security | Authentication and authorization |
| JWT | Stateless token-based authentication |
| Hibernate | ORM for entity-to-database mapping |
| JPA | Persistence abstraction layer |
| REST API | Client-server communication contract |
| MySQL | Relational database |

### AI / Automation

| Technology | Purpose |
|---|---|
| OCR | Text extraction from scanned answer sheets |
| Keyword Matching | Similarity-based mark prediction |
| Python | AI/automation scripting language |
| Google OR-Tools | Constraint optimization toolkit |
| CP-SAT Solver | Conflict-free timetable generation |

### Database

| Technology | Purpose |
|---|---|
| MySQL | Primary relational data store |

### Tools

| Tool | Purpose |
|---|---|
| Git | Version control |
| GitHub | Source hosting and collaboration |
| Maven | Backend build and dependency management |
| VS Code | Frontend development IDE |
| IntelliJ IDEA | Backend development IDE |
| Postman | API testing and documentation |

---

## 🗄️ Backend Folder Structure

```
erp/
└── src/
    └── main/
        ├── java/
        │   └── com.college.erp/
        │       ├── admissions/
        │       │   ├── config/
        │       │   ├── controller/
        │       │   ├── dto/
        │       │   ├── entity/
        │       │   ├── repository/
        │       │   └── service/
        │       ├── attendance/
        │       ├── config/
        │       ├── connect/
        │       ├── erp/
        │       ├── evaluation/
        │       ├── exception/
        │       ├── security/
        │       ├── CollegeErpUnifiedApplication.java
        │       └── JpaBeanPrinter.java
        └── resources/
```

---

## 🎨 Frontend Folder Structure

```
src/
├── assets/
├── class/
├── components/
├── lib/
├── modules/
│   ├── admission-module/
│   ├── admissions/
│   ├── attendance/
│   ├── college_connect/
│   ├── college-erp-frontend/
│   ├── erp/
│   ├── evaluation/
│   └── platform/
├── pages/
├── services/
├── store/
├── types/
├── utils/
├── App.tsx
├── Dashboard.tsx
└── main.tsx
```

---

## 🗃️ Database Overview

The database is designed around normalized, relational entities that map directly to Smart ERP's core domains:

- **Students** — Personal, academic, and admission-related student records.
- **Faculty** — Staff profiles, department affiliation, and subject assignments.
- **Departments** — Institutional department metadata and HOD mapping.
- **Admissions** — Application data, document status, cutoff scores, and seat allocation results.
- **Tests** — Quiz and coding-test definitions, submissions, and generated marks.
- **Analytics** — Aggregated performance metrics, risk flags, and comparative statistics.
- **Evaluation** — Scanned answer-sheet references, OCR output, predicted marks, and faculty overrides.
- **Timetable** — Generated schedules, faculty-subject-slot mappings, and export metadata.

Relationships are enforced through foreign keys (e.g., `Student ↔ Admission`, `Faculty ↔ Department`, `Evaluation ↔ Student/Exam`) to preserve referential integrity across modules.

---

## 🔐 Authentication Flow

Smart ERP uses **stateless JWT authentication** combined with **Role-Based Access Control (RBAC)**:

1. User submits credentials to the `/auth/login` endpoint.
2. Spring Security validates credentials against the persisted user store.
3. On success, the server issues a signed JWT containing the user's identity and role claims.
4. The client stores the token and attaches it as a `Bearer` token on every subsequent request.
5. A custom JWT filter intercepts each request, validates the token signature and expiry, and populates the Spring Security context.
6. Role-based authorization rules (method or endpoint level) restrict access according to the authenticated role.

**Supported Roles**
- 🛡️ Admin
- 🏛️ HOD
- 👨‍🏫 Staff
- 🎓 Student

---

## 🔌 API Overview

Representative REST endpoints across core modules:

```
POST   /api/auth/login              → Authenticate user and issue JWT
POST   /api/auth/register           → Register a new user account

GET    /api/admissions              → List admission applications
POST   /api/admissions              → Submit a new admission application
PUT    /api/admissions/{id}/verify  → Staff verifies/rejects documents
POST   /api/admissions/{id}/allocate→ Trigger automated seat allocation

GET    /api/students                → List students
POST   /api/students                → Create a student record
PUT    /api/students/{id}           → Update a student record
DELETE /api/students/{id}           → Delete a student record

GET    /api/faculty                 → List faculty members
POST   /api/timetable/generate      → Trigger constraint-based timetable generation
GET    /api/timetable/export        → Export timetable as PDF/Excel

POST   /api/connect/quiz            → Create a quiz or coding test
POST   /api/connect/submit          → Submit assessment answers
GET    /api/connect/coins           → View/redeem coin balance

POST   /api/evaluation/upload       → Upload scanned answer sheet for OCR evaluation
GET    /api/evaluation/{id}         → Get predicted marks for review
PUT    /api/evaluation/{id}/override→ Faculty overrides predicted marks

GET    /api/analytics/faculty       → Faculty-facing analytics dashboard data
GET    /api/analytics/student       → Student-facing analytics dashboard data
```

> Full endpoint documentation with request/response schemas is available via the Postman collection in `/docs/postman`.

---

## ⚙️ Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/smart-erp.git
cd smart-erp
```

### 2. Database Configuration

```sql
CREATE DATABASE smart_erp;
```

Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_erp
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### 3. Backend Setup

```bash
cd erp
mvn clean install
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

### 5. Python (AI/Automation) Setup

```bash
cd ai-services
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## ▶️ Running the Project

**Start the Backend**

```bash
cd erp
mvn spring-boot:run
```

**Start the Frontend**

```bash
cd frontend
npm run dev
```

**Start the AI/Automation Services**

```bash
cd ai-services
source venv/bin/activate
python app.py
```

The application will be available at:

- Frontend → `http://localhost:5173`
- Backend API → `http://localhost:8080`

---


---

## 🚀 Future Enhancements

1. Mobile application (React Native) for students and faculty
2. Push notifications via Firebase Cloud Messaging
3. Biometric/QR-based attendance integration
4. Real-time chat between students, faculty, and HODs
5. Integration of a full plagiarism-detection engine for coding assessments
6. Advanced AI grading using large language models for descriptive answers
7. Multi-institution / multi-tenant SaaS support
8. Payment gateway integration for admission fees
9. Automated fee receipt and invoice generation
10. Role-based dashboards with customizable widgets
11. Integration with Google Calendar/Outlook for timetable sync
12. Voice-based accessibility features for visually impaired users
13. Blockchain-based certificate verification
14. Microservices migration for independent module scaling
15. CI/CD pipeline with automated testing and deployment
16. Dockerized deployment with Kubernetes orchestration
17. GraphQL API layer as an alternative to REST
18. Dark mode and full theming support across the frontend

---

## 📚 Learning Outcomes

Building Smart ERP reinforced core software engineering principles beyond typical coursework:

- **Layered Architecture** — Practical application of controller-service-repository separation and clean dependency boundaries.
- **Modular Design** — Structuring a monolith into independently maintainable domain modules (admissions, evaluation, connect, erp).
- **Authentication & Security** — Implementing stateless JWT auth, RBAC, and securing REST endpoints against unauthorized access.
- **Database Design** — Normalizing relational schemas and managing entity relationships via JPA/Hibernate.
- **API Design** — Designing consistent, versioned REST contracts consumed by a strongly-typed frontend.
- **Constraint-Based Algorithms** — Applying Google OR-Tools CP-SAT to solve real-world scheduling conflicts.
- **AI/OCR Integration** — Bridging a Java backend with Python-based OCR and similarity-matching services.
- **Frontend Engineering** — Building a scalable, type-safe SPA with React, TypeScript, and centralized state management.
- **Full-Stack Integration** — Coordinating independently developed frontend, backend, and AI services into one cohesive product.
- **Team Collaboration** — Using Git/GitHub workflows for version control, code review, and parallel development across modules.

---
