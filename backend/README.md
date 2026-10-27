# Backend — Abdulwasiu Portfolio API

> Node.js + Express + TypeScript REST API

**Base URL:** `http://localhost:4000/api/v1`

---

## 📁 Folder Structure

```
backend/src/
├── index.ts              # Entry point — starts the HTTP server
├── app.ts                # Express app setup (middleware, routes)
├── server.ts             # Server bootstrap + DB connection
│
├── config/
│   ├── index.ts          # Re-exports all config
│   ├── database.ts       # Prisma client singleton
│   ├── cors.ts           # CORS options
│   ├── env.ts            # Validated environment variables (Zod)
│   └── logger.ts         # Winston logger setup
│
├── types/
│   ├── index.ts          # Re-exports all types
│   ├── express.d.ts      # Express Request augmentation
│   ├── project.types.ts  # Project entity types
│   ├── contact.types.ts  # Contact form types
│   └── common.types.ts   # Shared types (ApiResponse, Pagination)
│
├── models/
│   ├── index.ts          # Re-exports all models
│   ├── Project.model.ts  # Project Prisma model queries
│   ├── Contact.model.ts  # Contact Prisma model queries
│   ├── Skill.model.ts    # Skill Prisma model queries
│   └── PMProject.model.ts # PM project Prisma model queries
│
├── controllers/          # Request handlers (thin layer)
│   ├── index.ts
│   ├── project.controller.ts
│   ├── contact.controller.ts
│   ├── skill.controller.ts
│   ├── pm.controller.ts
│   └── health.controller.ts
│
├── routes/               # Express routers
│   ├── index.ts          # Version registry — GET /api, mounts /v1, rejects unknown versions
│   └── v1/               # Everything served under /api/v1
│       ├── index.ts      # Mounts the v1 resource routers
│       ├── project.routes.ts # GET /projects, GET /projects/:slug
│       ├── contact.routes.ts # POST /contact
│       ├── skill.routes.ts   # GET /skills
│       ├── pm.routes.ts      # GET /pm-projects
│       └── health.routes.ts  # GET /health
│
├── services/             # Business logic layer
│   ├── index.ts
│   ├── project.service.ts
│   ├── contact.service.ts
│   ├── skill.service.ts
│   ├── pm.service.ts
│   └── email.service.ts  # Nodemailer email sending
│
├── middleware/           # Express middleware
│   ├── index.ts
│   ├── errorHandler.ts   # Global error handler
│   ├── requestLogger.ts  # Request logging (Morgan/Winston)
│   ├── validateRequest.ts # Zod request body validation
│   ├── rateLimit.ts      # express-rate-limit config
│   └── auth.ts           # JWT auth (future admin routes)
│
└── utils/
    ├── index.ts
    ├── response.ts       # Standardised API response helpers
    ├── asyncHandler.ts   # Wraps async controllers (no try/catch)
    ├── validators.ts     # Zod schemas for request validation
    └── sanitize.ts       # Input sanitization helpers
```

## 🌐 API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api` | Lists supported API versions |
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/projects` | List all projects |
| GET | `/api/v1/projects/:slug` | Single project detail |
| GET | `/api/v1/skills` | List all skills |
| GET | `/api/v1/pm-projects` | List PM projects |
| POST | `/api/v1/contact` | Submit contact form |

See [../docs/api/endpoints.md](../docs/api/endpoints.md) for full API docs, and
[../docs/api/versioning.md](../docs/api/versioning.md) for how API versions work.

## 🛠 Available Scripts

```bash
pnpm dev           # Start with nodemon hot-reload → localhost:4000
pnpm build         # Compile TypeScript to dist/
pnpm start         # Run compiled production build
pnpm db:migrate    # Run Prisma migrations
pnpm db:generate   # Generate Prisma client
pnpm db:seed       # Seed database
pnpm db:studio     # Open Prisma Studio GUI
```
