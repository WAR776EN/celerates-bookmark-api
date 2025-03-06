# Celerates Bookmark API

## Overview

The Bookmark Management API is a RESTful service built with **Hono.js** and **PostgreSQL** for managing bookmarks. It includes user authentication, bookmark CRUD operations, categorization, tagging, and search functionality.

## Features

- **User Authentication** (JWT-based)
- **Bookmark CRUD** (Create, Read, Update, Delete)
- **Categorization & Tagging**
- **Full-text search** (Title, URL, Category, Tags)
- **PostgreSQL with Prisma ORM**
- **Input validation & error handling**

## Tech Stack

- **Backend:** Hono.js (TypeScript)
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Environment Management:** Dotenv

---

## Installation & Setup

### Prerequisites

- **Node.js** (v18+ recommended)
- **PostgreSQL** (Local or Docker)
- **Docker** (Optional for containerized setup)

### 1️⃣ Clone the Repository

```sh
 git clone https://github.com/WAR776EN/celerates-bookmark-api.git
 cd celerates-bookmark-api
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file and set the following values:

```env
PORT=<your desired port>
DATABASE_URL=postgresql://user:password@localhost:5432/bookmarks
JWT_ACCESS_SECRET=<your_secret_key>
JWT_REFRESH_SECRET=<refresh_key>
SALTROUND=10
```

### 4️⃣ Setup the Database (Prisma Migrations)

```sh
npx prisma migrate dev --name init
```

### 5️⃣ Start the Server

#### Development Mode

```sh
npx tsx src/app.ts
```

---

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate user & return JWT
- `POST /auth/refresh-token` - Refresh JWT token

### Bookmarks

- `GET /bookmarks` - List all bookmarks
- `POST /bookmarks` - Create a new bookmark
- `GET /bookmarks/{id}` - Get a specific bookmark
- `PUT /bookmarks/{id}` - Update a bookmark
- `DELETE /bookmarks/{id}` - Delete a bookmark

### Categories

- `GET /categories` - Retrieve categories
- `POST /categories` - Create a category
- `PUT /categories/{id}` - Update a category
- `DELETE /categories/{id}` - Delete a category

### Searching & Filtering

- `GET /bookmarks/search?q=react` - Full-text search (on development)

---
