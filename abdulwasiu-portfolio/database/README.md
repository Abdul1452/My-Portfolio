# Database — PostgreSQL + Prisma

## Structure

```
database/
├── schemas/
│   ├── schema.sql      # Raw SQL schema (reference / Docker init)
│   └── schema.prisma   # Prisma schema (source of truth for ORM)
│
├── migrations/
│   ├── 001_initial_schema.sql    # Base tables
│   ├── 002_projects_table.sql    # Projects + pm_projects tables
│   ├── 003_contacts_table.sql    # Contact submissions table
│   └── 004_skills_table.sql      # Skills + categories tables
│
└── seeds/
    ├── seed.ts           # Main seed runner
    ├── projects.seed.ts  # Engineering project seed data
    └── skills.seed.ts    # Skill categories seed data
```

## Tables

| Table | Description |
|---|---|
| `projects` | Engineering portfolio projects |
| `pm_projects` | Project management deliverables |
| `skills` | Individual skills |
| `skill_categories` | Skill groupings (Frontend, Backend…) |
| `contacts` | Contact form submissions |

## Commands

```bash
# From /backend directory:
pnpm db:migrate      # Apply all pending migrations
pnpm db:generate     # Re-generate Prisma client after schema change
pnpm db:seed         # Populate with initial data
pnpm db:studio       # Open visual DB browser at localhost:5555
```
