# Abdulwasiu Abdullahi Olamilekan — Portfolio

> Full-stack portfolio website built with React + TypeScript (frontend) and Node.js + Express + TypeScript (backend), backed by a PostgreSQL database.

**Live:** https://abdulwasiu.dev  
**Figma Design:** https://www.figma.com/design/yvwX9f1hdoEpidLPBewcV6  
**Author:** Abdulwasiu Abdullahi Olamilekan

---

## 🗂 Project Structure

```
abdulwasiu-portfolio/
├── frontend/          # React + TypeScript + Vite + Tailwind
├── backend/           # Node.js + Express + TypeScript REST API
├── database/          # PostgreSQL schema, migrations & seeds
├── docs/              # Architecture, API, and design documentation
├── .github/           # CI/CD GitHub Actions workflows
├── docker-compose.yml # Local development orchestration
├── .env.example       # Root-level environment variable template
└── README.md          # You are here
```

---

## 🚀 Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 18 | UI library |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| CSS Modules | Component-scoped styles |
| React Router v6 | Client-side routing |

### Backend
| Tech | Purpose |
|---|---|
| Node.js | Runtime |
| Express | HTTP framework |
| TypeScript | Type safety |
| Prisma | ORM & database client |
| PostgreSQL | Primary database |
| Zod | Runtime validation |
| Nodemailer | Contact form emails |

---

## ⚡ Quick Start

### Prerequisites
- Node.js >= 18
- pnpm >= 8 (or npm/yarn)
- Docker (for local Postgres via docker-compose)
- PostgreSQL (if running without Docker)

### 1. Clone & install
```bash
git clone https://github.com/abdulwasiu/portfolio.git
cd abdulwasiu-portfolio
```

### 2. Environment variables
```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
# Edit each .env file with your values
```

### 3. Start local database
```bash
docker-compose up -d db
```

### 4. Start frontend
```bash
cd frontend
pnpm install
pnpm dev
# → http://localhost:5173
```

### 5. Start backend
```bash
cd backend
pnpm install
pnpm dev
# → http://localhost:4000
```

---

## 📁 Detailed Structure

See [docs/SETUP.md](docs/SETUP.md) for full environment setup.  
See [docs/architecture/overview.md](docs/architecture/overview.md) for system design.  
See [docs/api/endpoints.md](docs/api/endpoints.md) for API reference.

---

## 🤝 Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

---

## 📄 License

MIT © 2025 Abdulwasiu Abdullahi Olamilekan
