# 📄 Backend PRD – Project Management Tool API

---

## 1. 📌 Product Overview

The Project Management Tool API is a scalable RESTful backend system designed to manage projects, tasks, teams, and collaboration workflows.

It serves as the core backend for:

* Web applications (React dashboards)
* Mobile apps
* Third-party integrations (future)

---

## 2. 🎯 Goals & Objectives

### Primary Goals

* Build a scalable RESTful API
* Enable structured project/task workflows
* Support multi-user collaboration
* Ensure secure and high-performance backend

### Secondary Goals

* Maintain clean modular architecture
* Enable future real-time features
* Provide developer-friendly API design

---

## 3. 👥 User Roles & Permissions

### Admin (Project Owner)

* Full project control
* Add/remove members
* Assign tasks
* Delete project

### Member

* View projects
* Manage assigned tasks
* Comment on tasks

---

## 4. 🧩 Core Functional Requirements

### 4.1 Authentication

* Register user
* Login user (JWT)
* Secure password hashing (bcrypt)
* Token expiration

---

### 4.2 User Management

* Get current user profile
* Update profile

---

### 4.3 Project Management

* Create project
* Update project
* Delete project
* Get all user projects
* Get project by ID

#### Rules

* Only owner can delete project
* Owner auto-added as member

---

### 4.4 Team Management

* Add member
* Remove member
* List members

#### Rules

* Only admin can manage members
* Owner cannot be removed

---

### 4.5 Task Management

* Create task
* Update task
* Delete task
* Assign task
* Set priority & due date

#### Status Flow

* Todo → In Progress → Done

---

### 4.6 Comments

* Add comment
* View comments
* Delete own comment

---

### 4.7 Activity Logs

* Track actions (task/project updates)
* Store user + timestamp

---

### 4.8 Notifications (Future)

* Email notifications
* In-app notifications

---

## 5. 🏗️ System Architecture

### Tech Stack

* Node.js (ES Modules)
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

---

### Architecture Flow

```
Client → API → Middleware → Routes → Services → Models → Database
```

---

### Folder Structure

```
project-management-api/

├── config/
│   └── db.js
├── models/
│   ├── User.js
│   ├── Project.js
│   ├── Task.js
│   ├── Comment.js
│   ├── Activity.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── project.routes.js
│   ├── task.routes.js
│   ├── comment.routes.js
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
├── utils/
│   └── logger.js
├── .env
├── app.js
└── server.js
```

---

## 6. 🗄️ Database Design

### User

```js
{
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: "admin" | "member",
  createdAt: Date
}
```

---

### Project

```js
{
  name: String,
  description: String,
  owner: ObjectId,
  members: [ObjectId],
  createdAt: Date
}
```

---

### Task

```js
{
  title: String,
  description: String,
  project: ObjectId,
  assignedTo: ObjectId,
  status: "todo" | "in-progress" | "done",
  priority: "low" | "medium" | "high",
  dueDate: Date,
  createdAt: Date
}
```

---

### Comment

```js
{
  task: ObjectId,
  user: ObjectId,
  text: String,
  createdAt: Date
}
```

---

### Activity Log

```js
{
  user: ObjectId,
  action: String,
  entityType: "task" | "project",
  entityId: ObjectId,
  createdAt: Date
}
```

---

## 7. 🔌 RESTful API Endpoints

### Auth

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

---

### Users

```
GET    /api/users/me
PUT    /api/users/me
```

---

### Projects

```
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

---

### Members

```
POST   /api/projects/:id/members
DELETE /api/projects/:id/members/:userId
GET    /api/projects/:id/members
```

---

### Tasks

```
POST   /api/tasks
GET    /api/tasks/project/:projectId
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

---

### Comments

```
POST   /api/comments
GET    /api/comments/:taskId
DELETE /api/comments/:id
```

---

## 8. 🔐 Security Requirements

* JWT authentication
* Password hashing (bcrypt)
* Role-based access control (RBAC)
* Input validation
* Rate limiting
* CORS configuration

---

## 9. ⚡ Performance Requirements

* Response time < 300ms
* Pagination support
* MongoDB indexing:

  * userId
  * projectId
  * taskId

---

## 10. 🧱 Non-Functional Requirements

* Scalable system design
* Clean modular codebase
* Centralized error handling
* Logging (Winston/Morgan)

---

## 11. 🧪 Testing Strategy

* Postman API testing
* Unit testing (Jest)
* Integration testing

---

## 12. 🚀 Deployment

* Use `.env` for configuration
* Deploy on:

  * Render / AWS / DigitalOcean
* MongoDB Atlas
* CI/CD (future)

---

## 13. 🧭 Development Roadmap

### Phase 1 (MVP)

* Auth
* Projects
* Tasks

### Phase 2

* Comments
* Activity logs

### Phase 3

* Notifications
* Real-time features

---

## 14. ⚠️ Risks & Challenges

* Permission complexity
* Data consistency
* Performance scaling
* Schema design issues

---

## 15. 📊 Success Metrics

* API uptime > 99%
* Low latency
* High reliability
* Smooth collaboration experience

---

## 16. 📌 Future Scope

* Kanban board API
* File uploads
* Time tracking
* Analytics dashboard
* Third-party integrations

---
