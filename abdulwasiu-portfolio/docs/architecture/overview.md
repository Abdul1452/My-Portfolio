# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER / CLIENT                    │
│              React + TypeScript + Vite                  │
│                   localhost:5173                        │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP / REST
                        │ /api/v1/*
┌───────────────────────▼─────────────────────────────────┐
│                    EXPRESS API                          │
│           Node.js + TypeScript + Zod                   │
│                   localhost:4000                        │
│                                                         │
│  Routes → Controllers → Services → Models              │
└───────────────────────┬─────────────────────────────────┘
                        │ Prisma ORM
┌───────────────────────▼─────────────────────────────────┐
│                   POSTGRESQL DB                         │
│                   localhost:5432                        │
│         projects | pm_projects | skills | contacts     │
└─────────────────────────────────────────────────────────┘
```

## Request Flow

1. React component calls `utils/api.ts` fetch wrapper
2. Request hits Express router (`routes/`)
3. Middleware: rate limit → CORS → request logger → validate body (Zod)
4. Controller calls appropriate service method
5. Service executes Prisma query via Model
6. Response formatted with `utils/response.ts` helper
7. JSON returned to frontend

## Design Decisions

| Decision | Rationale |
|---|---|
| Vite over CRA | Faster dev HMR, native ESM, smaller bundles |
| CSS Modules + Tailwind | Scoped styles for components, utilities for layout |
| Prisma over raw SQL | Type-safe queries, auto-generated client, easy migrations |
| Zod validation | Runtime type safety for API inputs and env vars |
| Layered backend | Testable: controllers are thin, logic lives in services |
