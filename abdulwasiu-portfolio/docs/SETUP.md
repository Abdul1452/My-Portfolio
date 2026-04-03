# Full Setup Guide

## Prerequisites
- Node.js >= 18 (`node -v`)
- pnpm >= 8 (`pnpm -v` or `npm install -g pnpm`)
- Docker Desktop (for local PostgreSQL)
- Git

## Step-by-step

### 1. Clone
```bash
git clone https://github.com/abdulwasiu/portfolio.git
cd abdulwasiu-portfolio
```

### 2. Install all dependencies
```bash
# From root — installs both frontend + backend
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
pnpm docker:up     # starts postgres container on port 5432
```

### 5. Run DB migrations
```bash
cd backend
pnpm db:migrate    # applies all migrations
pnpm db:seed       # loads initial data
cd ..
```

### 6. Start both servers
```bash
# From root, starts frontend + backend together
pnpm dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:4000/api/v1 |
| DB Studio | http://localhost:5555 (run `pnpm db:studio`) |

## Production Build
```bash
pnpm build
# Frontend build → frontend/dist/
# Backend build  → backend/dist/
```
