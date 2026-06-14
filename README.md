# Task Manager API

A RESTful Task Management API built using NestJS, Prisma, PostgreSQL, JWT Authentication, Redis Caching, Swagger Documentation, and Docker.

## Features

- User Registration and Login
- JWT Authentication
- CRUD Operations for Tasks
- Advanced Filtering and Sorting for Tasks
- Pagination for Tasks
- User-specific Task Access Control
- Prisma ORM with PostgreSQL
- Request Logging Middleware
- Global Exception Handling
- Swagger API Documentation
- Dockerized Application
- Docker Compose Setup
- Redis-backed Caching for Task Retrieval
- Health Check Endpoint

---

## Tech Stack

### Backend
- NestJS
- TypeScript
- Node.js

### Database
- PostgreSQL
- Prisma ORM

### Authentication
- JWT (JSON Web Tokens)

### Caching
- Cacheable
- Redis

### Documentation
- Swagger

### DevOps
- Docker
- Docker Compose

---

## Project Structure

```text
src/
├── auth/
├── cache/
├── database/
├── health/
├── tasks/
├── users/
├── utils/
└── main.ts
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|----------|----------|----------|
| POST | /users | Register a new user |
| POST | /auth/login | Login and receive JWT |

---

### Users

| Method | Endpoint | Description |
|----------|----------|----------|
| GET | /users | Get all users |
| GET | /users/:id | Get user by ID |
| DELETE | /users/:id | Delete user |

---

### Tasks

| Method | Endpoint | Description |
|----------|----------|----------|
| POST | /tasks | Create task |
| GET | /tasks | Get all tasks for authenticated user |
| GET | /tasks/:id | Get task by ID |
| PATCH | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |

---

### Health

| Method | Endpoint |
|----------|----------|
| GET | /health |

---

## Environment Variables

Create a `.env` file in the project root.

```env
DATABASE_URL=postgresql://user:password@localhost:5432/tasksdb

SECRET=your_jwt_secret

REDIS_URL=redis://localhost:6379
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/faizan-22/task-manager-api.git
cd task-manager-api
```

### Install Dependencies

```bash
npm install
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Migrations

```bash
npx prisma migrate dev
```

### Start Application

```bash
npm run start:dev
```

Server will run on:

```text
http://localhost:3000
```

---

## Swagger Documentation

After starting the application:

```text
http://localhost:3000/docs
```

Swagger UI provides interactive API documentation and JWT authentication support.

---

## Docker

### Build Image

```bash
docker build -t task-manager .
```

### Run Container

```bash
docker run --env-file .env -p 3000:3000 task-manager
```

---

## Docker Compose

Start application and supporting services:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d
```

Stop containers:

```bash
docker compose down
```

Remove containers and volumes:

```bash
docker compose down -v
```

---

## Authentication Flow

1. Register a user using:

```http
POST /users
```

2. Login using:

```http
POST /auth/login
```

3. Copy the returned JWT token.

4. Authorize using Swagger or send:

```http
Authorization: Bearer <token>
```

5. Access protected task endpoints.

---

## Caching

Task retrieval endpoints are cached using Redis.

Cached Endpoints:

```http
GET /tasks
GET /tasks/:id
```

### Current Limitation

Cache invalidation is not implemented.

If a task is updated or deleted, cached responses may temporarily return stale data until the cache expires.

---

## Security

- Passwords are hashed before storage.
- JWT-based authentication.
- Users can only access their own tasks.
- Protected endpoints use NestJS Guards.

---

## Screenshots
### Swagger UI
![Swagger UI](screenshots/swagger.png)

### Docker Compose
![Docker Compose](screenshots/docker-compose.png)

---

## Live Demo

API: https://task-manager-0063.onrender.com

Swagger: https://task-manager-0063.onrender.com/docs

---

## Future Improvements

- Cache Invalidation
- Unit Testing
- Integration Testing
- Role-Based Access Control (RBAC)
- Refresh Tokens
- Rate Limiting
- CI/CD Pipeline
- Kubernetes Deployment

---

## Learning Objectives

This project was built to gain hands-on experience with:

- NestJS Architecture
- Dependency Injection
- Authentication & Authorization
- Prisma ORM
- PostgreSQL
- Redis Caching
- Docker & Docker Compose
- API Documentation
- Backend Application Design

---

## Author

Faizan Sheikh

Software Engineer | Backend Development | Node.js | NestJS

GitHub: https://github.com/faizan-22