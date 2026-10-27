# THE BROADSIDE — High-Contrast Editorial Publishing Desk

> **"Unflinching technical clarity. Zero decoration. Every dispatch signed and verifiable."**

A production-grade FullStack JavaScript web application built to master the core fullstack syllabus: **Express.js**, **React**, **Prisma ORM**, **JWT Authentication**, and **React Context API**.

Designed in a **High-Contrast Editorial Broadside** aesthetic — drawing inspiration from 19th-century emergency news sheets, brutalist monochrome typography, ink rules, and bold newspaper mastheads.

---

## ✦ Syllabus Coverage Matrix

| Technology | Implementation in Project |
| :--- | :--- |
| **RESTful API** | Modular Express.js architecture (`/api/auth`, `/api/articles`, `/api/categories`, `/api/articles/stats`). Standard HTTP verbs, status codes, and JSON error handling. |
| **JWT** | Stateless token authentication using `jsonwebtoken`. Signed at login/registration, sent via `Authorization: Bearer <token>`, verified via route middleware. |
| **Prisma ORM** | Relational schema with `User`, `Category`, and `Article` models. Cascading relationships, custom slug generators, and seeder scripts (`prisma/seed.js`). Supports SQLite (default) and MySQL (FlyEnv). |
| **Context API** | Top-level `AuthContext.jsx` distributing session state, token persistence (`localStorage`), login, register, and logout handlers across the React app. |
| **Authentication** | Passwords securely hashed with `bcryptjs`. Protected routes for article creation, editing, and deletion. Role-based checks (`EDITOR`, `AUTHOR`). |

---

## ✦ Design System: High-Contrast Editorial Broadside

- **Palette:** Stark Monochrome (`#09090b` Ink Black, `#ffffff` Bleached Paper, `#f9f8f5` Newsprint Cream).
- **Typography:** Serif headlines (`Cinzel`, `Newsreader`, `Georgia`), Monospace tabular metadata (`JetBrains Mono`, `Courier New`).
- **Layout:** Broadsheet column grid, double hairline rules, editorial kicks, decks, drop-caps (`::first-letter`), and author colophons.

---

## ✦ Laravel Herd & FlyEnv Compatibility

The repository is built to live directly inside `C:\Users\Lenovo\Herd\broadside`:

- **Laravel Herd Site:** Appears in Herd sites. Herd serves `http://broadside.test`.
- **Valet Proxy Gateway:** `public/index.php` automatically reverse-proxies requests to the running Express app (`http://127.0.0.1:5000`) or displays an editorial standby status card if the node server is idle.
- **FlyEnv MySQL:** Switch to FlyEnv's local MySQL port 3306 anytime by modifying `DATABASE_URL` in `.env`.

---

## ✦ Quick Start

### 1. Install Dependencies
```bash
# In project root:
npm install

# In client directory:
cd client && npm install && cd ..
```

### 2. Database Setup & Seeding
```bash
# Push schema to SQLite database:
npm run db:push

# Populate sample users, editorial categories, and broadside articles:
npm run seed
```

### 3. Build Client & Start
```bash
# Build React frontend:
npm run build

# Start Express fullstack server:
npm start
```

Visit:
- **Direct Express Server:** [http://localhost:5000](http://localhost:5000)
- **Laravel Herd Domain:** [http://broadside.test](http://broadside.test)
- **API Overview:** [http://localhost:5000/api](http://localhost:5000/api)

---

## ✦ Pre-seeded Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Editor-in-Chief** | `editor@broadside.local` | `editor123` |
| **Author / Correspondent** | `fika@broadside.local` | `fika123` |

*(One-click demo login buttons are also built directly into the UI's login modal)*

---

## ✦ RESTful API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new correspondent (name, email, password, bio)
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve current authenticated user profile (Bearer token required)

### Articles & Broadsides (`/api/articles`)
- `GET /api/articles` — Query published articles (filters: `?category=`, `?search=`)
- `GET /api/articles/:slug` — Read full dispatch and related articles
- `POST /api/articles` — Publish new broadside dispatch (Protected)
- `PUT /api/articles/:id` — Update existing dispatch (Protected, owner/editor only)
- `DELETE /api/articles/:id` — Retract dispatch from archives (Protected, owner/editor only)
- `GET /api/articles/stats` — Editorial statistics (counts for dispatches, categories, authors)

### Categories (`/api/categories`)
- `GET /api/categories` — List all editorial categories with article counts

---

## ✦ Automated Test Suite

A standalone test suite validates all endpoints and authentication guards:
```bash
npm test
```
All 7 integration assertions verify:
1. API root handshake
2. Category listings
3. User credential authentication & JWT issuance
4. Bearer token verification
5. Dispatch publication
6. Dispatch modification
7. Dispatch retraction

---

## ✦ License
MIT © Devis Rumi
