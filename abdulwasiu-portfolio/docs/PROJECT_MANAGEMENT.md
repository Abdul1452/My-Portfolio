# Project Management Guide

> How this repository uses **milestones**, **labels**, and the **project board** to plan and track work.

---

## Milestone — v1.0.0 MVP Launch

| Field       | Value                                                                       |
|-------------|-----------------------------------------------------------------------------|
| **Title**   | `v1.0.0 — MVP Launch`                                                       |
| **Due**     | 2026-06-30                                                                  |
| **State**   | Open                                                                        |
| **Scope**   | All work required to ship a fully working, deployed portfolio site          |

### Milestone scope
- Frontend: all pages (Home, About, Projects, Contact), responsive design, animations
- Backend: REST API, contact form endpoint, health check
- Database: final schema, migrations, seed data
- Deployment: Vercel (frontend) + Railway or Render (backend)
- CI/CD: full lint → build → test → deploy pipeline

**Every issue or PR that targets the v1.0.0 release must be assigned this milestone.**

---

## Label Taxonomy

Labels are defined in [`.github/labels.yml`](../.github/labels.yml) and auto-synced via the `Sync Labels` workflow.

### Type — what kind of work is this?

| Label               | Color     | Meaning                                        |
|---------------------|-----------|------------------------------------------------|
| `type: feature`     | `#0075ca` | New feature or user-visible enhancement        |
| `type: bug`         | `#d73a4a` | Something is broken                            |
| `type: chore`       | `#e4e669` | Maintenance, tooling, dependency updates       |
| `type: docs`        | `#1d76db` | Documentation changes only                    |
| `type: refactor`    | `#e99695` | Code restructure without behavior change       |
| `type: test`        | `#f9d0c4` | Adding or improving tests                      |
| `type: ci`          | `#0e8a16` | GitHub Actions / CI-CD pipeline change         |

### Priority — how urgent is this?

| Label                | Color     | Meaning                                       |
|----------------------|-----------|-----------------------------------------------|
| `priority: critical` | `#b60205` | Blocks the release — fix immediately          |
| `priority: high`     | `#d93f0b` | Target current sprint                         |
| `priority: medium`   | `#fbca04` | Planned work for near-term sprint             |
| `priority: low`      | `#c2e0c6` | Nice-to-have, address when capacity allows    |

### Area — which layer is affected?

| Label            | Color     | Meaning                                          |
|------------------|-----------|--------------------------------------------------|
| `area: frontend` | `#bfd4f2` | React / TypeScript / Vite / Tailwind             |
| `area: backend`  | `#d4c5f9` | Node.js / Express / TypeScript / Prisma          |
| `area: database` | `#c2e0c6` | PostgreSQL schema, migrations, seeds             |
| `area: ci-cd`    | `#fef2c0` | GitHub Actions workflows and deployment scripts  |
| `area: docs`     | `#f9d0c4` | README, architecture docs, API docs              |
| `area: docker`   | `#e1f0ff` | Docker / docker-compose                          |

### Status — where is this in the workflow?

| Label                  | Color     | Meaning                                    |
|------------------------|-----------|--------------------------------------------|
| `status: ready`        | `#22c55e` | Fully scoped and ready to be picked up     |
| `status: in-progress`  | `#f97316` | Actively being worked on                   |
| `status: needs-review` | `#8b5cf6` | Waiting for code or design review          |
| `status: blocked`      | `#e11d48` | Blocked by another issue or dependency     |
| `status: wont-fix`     | `#ffffff` | Acknowledged but will not be addressed     |
| `status: duplicate`    | `#cfd3d7` | Duplicates an existing issue or PR         |

### Recommended combinations

```
type: feature  +  priority: high   +  area: frontend  +  status: ready
type: bug      +  priority: critical  +  area: backend   +  status: in-progress
type: chore    +  priority: low    +  area: ci-cd
```

---

## Project Board — Portfolio Development

The **Portfolio Development** board tracks all in-flight work from idea to shipped feature.

> **Setup:** Run the `Repo Setup — Milestone & Project Board` workflow once from the Actions tab.  
> A `PROJECTS_TOKEN` secret (PAT with `project` scope) must be added to the repository settings for project creation to succeed.

### Board columns

| Column        | Meaning                                                              |
|---------------|----------------------------------------------------------------------|
| **Backlog**   | Identified work — not yet prioritised or assigned                   |
| **Todo**      | Prioritised, assigned, and ready to start this sprint               |
| **In Progress** | Someone is actively working on this                              |
| **In Review** | PR open — awaiting review or CI result                              |
| **Done**      | Merged and deployed                                                  |

### Workflow rules

1. **New issue** → add to board, set column to `Backlog`, assign `status: ready` label  
2. **Pick up work** → move to `Todo`, add `status: in-progress`  
3. **Open PR** → move to `In Progress`, link the issue, assign `status: needs-review`  
4. **PR approved** → move to `In Review`  
5. **Merged** → board auto-moves to `Done` (configure via workflow automation in board settings)

### Automation (optional)

In the board settings enable:
- *Auto-add issues/PRs* when they are opened  
- *Move to Done* when a PR is merged  
- *Move to In Review* when a PR review is requested  

---

## How to apply to a new issue

```bash
# Create issue with full labelling and milestone
gh issue create \
  --title "Implement contact form API endpoint" \
  --body  "POST /api/contact — sends email via Nodemailer" \
  --label "type: feature,priority: high,area: backend,status: ready" \
  --milestone "v1.0.0 — MVP Launch"
```

---

*This document is the single source of truth for project management practices in this repository.*
