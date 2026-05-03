# Project Management Tool
## Product Requirements Document

> **Version:** 1.0 | **Status:** Draft | **Date:** May 2026 | **Classification:** Confidential

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Goals & Objectives](#2-goals--objectives)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Functional Requirements](#4-functional-requirements)
5. [RESTful API Endpoints](#5-restful-api-endpoints)
6. [Database Design](#6-database-design)
7. [System Architecture](#7-system-architecture)
8. [Security Requirements](#8-security-requirements)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Testing Strategy](#10-testing-strategy)
11. [Deployment & Infrastructure](#11-deployment--infrastructure)
12. [Development Roadmap](#12-development-roadmap)
13. [Risks & Mitigation](#13-risks--mitigation)
14. [Success Metrics](#14-success-metrics)

---

## 1. Product Overview

The **Project Management Tool API** is a scalable RESTful backend system designed to manage projects, tasks, teams, and collaboration workflows. It serves as the core backend for web applications, mobile apps, and future third-party integrations.

### Consumers
- Web applications (React dashboards)
- Mobile apps (iOS & Android)
- Third-party integrations *(future)*

---

## 2. Goals & Objectives

### Primary Goals
- Build a scalable, well-structured RESTful API
- Enable structured project and task management workflows
- Support secure multi-user collaboration
- Ensure high-performance and secure backend operations

### Secondary Goals
- Maintain clean modular architecture for long-term maintainability
- Enable future real-time features (WebSockets, notifications)
- Provide a developer-friendly API design with clear documentation

---

## 3. User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** (Project Owner) | Full project control · Add/remove members · Assign tasks · Delete project |
| **Member** | View projects · Manage assigned tasks · Comment on tasks |

---

## 4. Functional Requirements

### 4.1 Authentication
- User registration with email and secure password
- User login returning a signed JWT token
- Secure password hashing via **bcrypt**
- Token expiration and refresh handling

### 4.2 User Management
- Retrieve the current authenticated user's profile
- Update profile details (name, email, avatar)

### 4.3 Project Management
- Full CRUD operations on projects
- List all projects for the authenticated user
- Only the project **owner** may delete a project
- Owner is automatically added as a member on project creation

### 4.4 Team Management
- Add and remove project members
- List all members of a project
- Only the **Admin** role can manage membership
- The project owner **cannot** be removed

### 4.5 Task Management
- Full CRUD operations on tasks within a project
- Assign tasks to project members
- Set priority: `low` | `medium` | `high`
- Set and track due dates

**Status Workflow:**
```
Todo → In Progress → Done
```

### 4.6 Comments
- Add comments to any task
- View all comments on a task
- Users may delete their own comments only

### 4.7 Activity Logs
- Automatically track all task and project update actions
- Store user reference and timestamp with each log entry

### 4.8 Notifications *(Future)*
- Email notifications for assignments and mentions
- In-app real-time notification feed

---

## 5. RESTful API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/auth/me` | Get authenticated user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/me` | Get current user profile |
| `PUT` | `/api/users/me` | Update current user profile |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/projects` | List all user projects |
| `GET` | `/api/projects/:id` | Get project by ID |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project *(owner only)* |

### Members
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/projects/:id/members` | Add a member |
| `DELETE` | `/api/projects/:id/members/:userId` | Remove a member |
| `GET` | `/api/projects/:id/members` | List all members |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks/project/:projectId` | List tasks in a project |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/comments` | Add a comment |
| `GET` | `/api/comments/:taskId` | Get comments for a task |
| `DELETE` | `/api/comments/:id` | Delete a comment |

---

## 6. Database Design

### User
```js
{
  name:      String,
  email:     { type: String, unique: true },
  password:  String,                          // bcrypt hashed
  role:      "admin" | "member",
  createdAt: Date
}
```

### Project
```js
{
  name:        String,
  description: String,
  owner:       ObjectId,                      // ref: User
  members:     [ObjectId],                    // ref: User[]
  createdAt:   Date
}
```

### Task
```js
{
  title:       String,
  description: String,
  project:     ObjectId,                      // ref: Project
  assignedTo:  ObjectId,                      // ref: User
  status:      "todo" | "in-progress" | "done",
  priority:    "low" | "medium" | "high",
  dueDate:     Date,
  createdAt:   Date
}
```

### Comment
```js
{
  task:      ObjectId,                        // ref: Task
  user:      ObjectId,                        // ref: User
  text:      String,
  createdAt: Date
}
```

### Activity Log
```js
{
  user:       ObjectId,                       // ref: User
  action:     String,
  entityType: "task" | "project",
  entityId:   ObjectId,
  createdAt:  Date
}
```

---

## 7. System Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js (ES Modules) | Server-side JavaScript |
| Framework | Express.js | HTTP routing & middleware |
| Database | MongoDB + Mongoose | Document storage & ODM |
| Auth | JWT + bcrypt | Token auth & password hashing |
| Logging | Winston / Morgan | Request & application logging |

### Request Flow
```
Client → API → Auth Middleware → Route Handler → Service Layer → Models → MongoDB
```

### Folder Structure
```
project-management-api/
├── config/
│   └── db.js                  # Database connection
├── models/
│   ├── User.js
│   ├── Project.js
│   ├── Task.js
│   ├── Comment.js
│   └── Activity.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── project.routes.js
│   ├── task.routes.js
│   └── comment.routes.js
├── middleware/
│   ├── auth.middleware.js     # JWT guard
│   └── error.middleware.js    # Centralized error handler
├── utils/
│   └── logger.js
├── .env
├── app.js
└── server.js
```

---

## 8. Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| JWT Authentication | All protected routes require a valid `Bearer` token |
| Password Hashing | bcrypt with minimum 10 salt rounds |
| Role-Based Access (RBAC) | Admin vs. Member permissions enforced at route level |
| Input Validation | Sanitize and validate all incoming request payloads |
| Rate Limiting | `express-rate-limit` to prevent brute-force attacks |
| CORS Configuration | Whitelist approved client origins only |

---

## 9. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | API response time < 300 ms (p95) under normal load |
| Scalability | Horizontally scalable; stateless API design |
| Availability | Target uptime > 99% |
| Pagination | All list endpoints support cursor or offset pagination |
| Indexing | MongoDB indexes on `userId`, `projectId`, `taskId` |
| Logging | Centralized request and error logging via Winston / Morgan |
| Error Handling | Consistent JSON error responses with appropriate HTTP status codes |
| Code Quality | Modular architecture; ESLint enforced; documented public APIs |

---

## 10. Testing Strategy

| Type | Tooling | Scope |
|------|---------|-------|
| Unit Testing | Jest | Services, utilities, and model methods |
| Integration Testing | Jest + Supertest | API endpoints with a test database |
| Manual API Testing | Postman | All endpoint flows, edge cases, and errors |
| Load Testing | k6 / Artillery *(future)* | Stress test under concurrent requests |

---

## 11. Deployment & Infrastructure

| Component | Details |
|-----------|---------|
| Hosting | Render / AWS Elastic Beanstalk / DigitalOcean App Platform |
| Database | MongoDB Atlas (managed cloud database) |
| Secrets | All credentials in `.env`; never committed to source control |
| CI/CD | GitHub Actions pipeline *(Phase 2)* |
| Environments | Development · Staging · Production |

---

## 12. Development Roadmap

| Phase | Features | Goal |
|-------|----------|------|
| **Phase 1 — MVP** | Auth, Projects, Tasks | Core working product |
| **Phase 2** | Comments, Activity Logs | Enhanced collaboration |
| **Phase 3** | Notifications, Real-time (WebSocket) | Live collaboration |
| **Future Scope** | Kanban API, File uploads, Time tracking, Analytics, Integrations | Platform growth |

---

## 13. Risks & Mitigation

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Permission complexity leading to security gaps | Medium | Thorough RBAC unit tests; peer code review |
| Data consistency issues across collections | Medium | Mongoose transactions; atomic updates |
| Performance degradation at scale | Low | Early indexing strategy; load testing in staging |
| Schema design requiring migration | Low | Schema versioning; migration scripts |

---

## 14. Success Metrics

| Metric | Target |
|--------|--------|
| API Uptime | > 99% monthly |
| P95 Response Time | < 300 ms |
| Error Rate | < 0.5% of total requests |
| Test Coverage | > 80% on service/route layer |

---

*Project Management Tool PRD — v1.0 — Confidential*
