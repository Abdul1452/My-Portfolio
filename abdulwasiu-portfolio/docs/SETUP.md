# Full Setup Guide

## Prerequisites

- Node.js >= 18 (`node -v`)
- pnpm >= 8 (`pnpm -v` or `npm install -g pnpm`)
- Docker Desktop for local PostgreSQL
- Git

## Quick Bootstrap

```bash
./setup.sh
```

That creates missing `.env` files, installs workspace dependencies, and runs
`pnpm db:generate`.

## Manual Setup

### 1. Clone

```bash
git clone https://github.com/abdulwasiu/portfolio.git
cd abdulwasiu-portfolio
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment setup

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

Edit each `.env` with your actual values.

### 4. Start PostgreSQL

```bash
pnpm docker:up
```

### 5. Prepare the database

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

### 6. Start both servers

```bash
pnpm dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:4000/api/v1 |
| DB Studio | http://localhost:5555 |

Run DB Studio with:

```bash
pnpm db:studio
```

## Production Build

```bash
pnpm build
```

- Frontend build output: `frontend/dist/`
- Backend build output: `backend/dist/`
