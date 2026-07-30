# Database - PostgreSQL + Prisma

## Structure

```text
database/
├── schemas/
│   └── schema.sql      # Raw SQL schema reference / Docker init
│
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_projects_table.sql
│   ├── 003_contacts_table.sql
│   └── 004_skills_table.sql
│
└── seeds/
    ├── seed.ts
    ├── projects.seed.ts
    └── skills.seed.ts
```

The Prisma schema lives at `backend/prisma/schema.prisma`. Keeping it inside
`backend/` lets Prisma and pnpm resolve `@prisma/client` from the backend
package instead of trying to auto-install it from the repository root.

## Tables

| Table | Description |
|---|---|
| `projects` | Engineering portfolio projects |
| `pm_projects` | Project management deliverables |
| `skills` | Individual skills |
| `skill_categories` | Skill groupings |
| `contacts` | Contact form submissions |

## Commands

```bash
# From the repository root:
pnpm db:generate     # Re-generate Prisma client after schema changes
pnpm db:migrate      # Apply Prisma migrations
pnpm db:seed         # Populate with initial data
pnpm db:studio       # Open visual DB browser at localhost:5555
```
