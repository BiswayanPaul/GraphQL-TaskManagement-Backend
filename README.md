# 🚀 GraphQL Task Management Backend

A production-grade backend system built using GraphQL, Node.js, and PostgreSQL that implements a complete task lifecycle with role-based access control and approval workflows.

---

## 🔥 Features

- 🔐 JWT Authentication (Access + Refresh tokens in HTTP-only cookies)
- 👥 Role-based authorization (ADMIN / USER)
- 🧠 Task lifecycle management:
  - `PENDING → IN_PROGRESS → COMPLETION_REQUESTED → COMPLETED / REJECTED`

- ✅ Admin approval system
- ❌ Rejection with reason tracking
- 🚫 Duplicate request prevention
- 🗂 Modular architecture (Resolvers, Middleware, Context)

---

## 🛠 Tech Stack

- Node.js
- Express.js
- GraphQL (Apollo Server)
- PostgreSQL
- Prisma ORM
- JWT Authentication

---

## 🧠 Architecture Overview

- Context-based authentication
- Resolver separation:
  - Auth
  - Task
  - TaskRequest

- Prisma for relational data modeling
- Middleware for request-level validation

---

## 📡 Sample GraphQL Operations

### Assign Task (Admin)

```json
mutation {
  assignTask(title: "Task A", userIds: [3]) {
    id
    title
    status
  }
}
```

### Start Task (User)

```json
mutation {
  startTask(taskId: 1) {
    id
    status
  }
}
```

### Request Completion

```json
mutation {
  requestCompletion(taskId: 1) {
    task { status }
    request { status }
  }
}
```

---

## ⚙️ Setup Instructions

1. Clone the repository

```bash
git clone <repo-url>
```

1. Install dependencies

```bash
npm install
```

1. Create `.env`

```env
DATABASE_URL=your_db_url
JWT_SECRET=your_secret
```

1. Run database

```bash
npx prisma db push
```

1. Start server

```bash
node src/index.js
```

---

## 🎯 Future Improvements

- Add database transactions for atomic operations
- Add pagination & filtering
- Add rate limiting
- Add GraphQL subscriptions
- Build frontend (React / Next.js)

---

<!-- ## 🎥 Demo

(Record Loom video and paste link here)

--- -->

## 👨‍💻 Author

Biswayan Paul
