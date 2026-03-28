# Person Management System

A full-stack web application for managing people records, built with **React**, **Node.js (Express)**, **PostgreSQL**, and containerized using **Docker Compose**.

## Project Description

This application allows users to:
- **Register** new people with a name and email
- **View** all registered people in a table
- **Edit** existing records (inline editing)
- **Delete** records (with confirmation dialog)

## Tech Stack

| Layer     | Technology           |
|-----------|----------------------|
| Frontend  | React 18 + Vite      |
| Backend   | Node.js + Express    |
| Database  | PostgreSQL 15        |
| Container | Docker + Docker Compose |

## Project Structure

```
project-root/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── index.js
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       └── pages/
│           ├── RegistrationForm.jsx
│           └── PeopleList.jsx
└── db/
    └── init.sql
```

## Setup & Run Instructions

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) installed and running

### Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Start the application:**
   ```bash
   docker compose up --build
   ```

4. **Access the application:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000/api/people](http://localhost:5000/api/people)

5. **Stop the application:**
   ```bash
   docker compose down
   ```

## API Endpoint Documentation

Base URL: `http://localhost:5000`

| Method | Endpoint          | Description       | Request Body                          |
|--------|-------------------|-------------------|---------------------------------------|
| GET    | `/api/people`     | Get all people    | —                                     |
| GET    | `/api/people/:id` | Get single person | —                                     |
| POST   | `/api/people`     | Create new person | `{ "full_name": "...", "email": "..." }` |
| PUT    | `/api/people/:id` | Update person     | `{ "full_name": "...", "email": "..." }` |
| DELETE | `/api/people/:id` | Delete person     | —                                     |

### Status Codes

| Code | Meaning           |
|------|--------------------|
| 200  | Success            |
| 201  | Created            |
| 400  | Validation error   |
| 404  | Not found          |
| 409  | Email conflict     |
| 500  | Server error       |

### Example Error Response

```json
{ "error": "EMAIL_ALREADY_EXISTS" }
```

## Environment Variables

| Variable    | Description                | Default    |
|-------------|----------------------------|------------|
| DB_HOST     | Database host              | db         |
| DB_PORT     | Database port              | 5432       |
| DB_USER     | Database user              | postgres   |
| DB_PASSWORD | Database password          | postgres   |
| DB_NAME     | Database name              | people_db  |
