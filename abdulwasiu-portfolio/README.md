# Abdulwasiu Abdullahi Olamilekan - Portfolio

Full-stack portfolio website built with React, TypeScript, Express, Prisma, and PostgreSQL.

**Live:** https://abdulwasiu.dev  
**Figma Design:** https://www.figma.com/design/yvwX9f1hdoEpidLPBewcV6  
**Author:** Abdulwasiu Abdullahi Olamilekan

## Project Structure

```text
abdulwasiu-portfolio/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Express + TypeScript + Prisma API
├── backend/prisma/    # Prisma schema
├── database/          # SQL reference files and seed data
├── docs/              # Architecture, API, and setup docs
├── docker-compose.yml # Local PostgreSQL service
└── setup.sh           # First-time setup helper
```

## Tech Stack

| Area | Tools |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, CSS Modules |
| Backend | Node.js, Express, TypeScript, Prisma, Zod, Nodemailer |
| Database | PostgreSQL |
| Tooling | pnpm workspaces, Docker Compose |

## Quick Start

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- Docker Desktop for local PostgreSQL

### Bootstrap

```bash
pnpm setup
```

Or run the same steps manually:

```bash
pnpm install
pnpm db:generate
```

Create and edit environment files if `setup.sh` did not already create them:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

Start the local database and prepare tables:

```bash
pnpm docker:up
pnpm db:migrate
pnpm db:seed
```

Start the app:

```bash
pnpm dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:4000/api/v1 |
| Prisma Studio | http://localhost:5555 |

Run Prisma Studio with:

```bash
pnpm db:studio
```

## Documentation

- [Full setup guide](docs/SETUP.md)
- [Architecture overview](docs/architecture/overview.md)
- [API reference](docs/api/endpoints.md)

## License

MIT © 2025 Abdulwasiu Abdullahi Olamilekan
