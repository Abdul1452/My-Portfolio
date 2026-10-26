/**
 * projects.seed.ts — Seed Data for Engineering & PM Projects
 *
 * WHAT IS A SEED FILE?
 *   A seed inserts initial/sample data into the database.
 *   Unlike migrations (which define structure), seeds define CONTENT.
 *
 * WHEN DO YOU RUN SEEDS?
 *   - Fresh local setup: populate with your real data so the frontend
 *     has something to display
 *   - Development: reset to a known state for testing
 *   - Production: insert the real portfolio data once at launch
 *
 * UPSERT:
 *   We use Prisma's `upsert` instead of `create`.
 *   Upsert = "Update if exists, Insert if not" (UPDATE OR INSERT).
 *
 *   Why? Because seeds are often re-run (e.g., you update a description
 *   and want to re-seed). With plain `create`, re-running would fail
 *   with a "slug already exists" unique constraint error.
 *   With `upsert`, re-running is safe and idempotent.
 *
 * IDEMPOTENT:
 *   Running the same operation multiple times produces the same result.
 *   A seed should be idempotent — you can run it 10 times and get
 *   the same clean data each time.
 */

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// ─── Engineering Projects ──────────────────────────────────────────────────────

export async function seedProjects() {
  console.log('  🔧 Seeding engineering projects...')

  const projects = [
    {
      id: 'cuid_project_petosvahti',
      slug: 'petosvahti',
      title: 'Petosvahti',
      tag: 'Python · FastAPI · Kafka · scikit-learn · Docker',
      description:
        'Real-time fraud detection for Finnish payments. Kafka streams transactions, an Isolation Forest scores them, FastAPI returns approve / review / block with reason codes. Written against PSD3 and SEPA Instant, with charter, risk register, ADRs and an EU compliance folder.',
      year: '2026',
      category: 'engineering',
      linkLabel: 'Repository',
      linkUrl: 'https://github.com/Abdul1452/Petosvahti-',
      imageUrl: null,
      featured: true,
      order: 1,
    },
    {
      id: 'cuid_project_slope_deflection',
      slug: 'slope-deflection-calculator',
      title: 'Slope Deflection Calculator',
      tag: 'Next.js 14 · TypeScript · Recharts',
      description:
        'Beam and rigid-frame analysis in the browser: fixed-end moments, joint equilibrium with sway, bending-moment and shear-force diagrams, support reactions.',
      year: '2025',
      category: 'engineering',
      linkLabel: 'Case study',
      linkUrl: 'https://github.com/Abdul1452/Slope-deflection-Calculator',
      imageUrl: null,
      featured: false,
      order: 2,
    },
    {
      id: 'cuid_project_serverless_quote',
      slug: 'serverless-quote-api',
      title: 'Serverless Quote API',
      tag: 'AWS SAM · Lambda · Python',
      description:
        'REST API plus a daily EventBridge job on AWS Lambda, deployed with SAM. Structured CloudWatch logging, pytest suite, GitHub Actions CI on every push.',
      year: '2025',
      category: 'engineering',
      linkLabel: 'Case study',
      linkUrl: 'https://github.com/Abdul1452/inspirational-quote-generator',
      imageUrl: null,
      featured: false,
      order: 3,
    },
  ]

  for (const project of projects) {
    await db.project.upsert({
      where: { slug: project.slug }, // Find by slug
      update: project,               // Update all fields if found
      create: project,               // Create with all fields if not found
    })
    console.log(`    ✓ ${project.title}`)
  }

  // Remove projects from earlier seed runs that are no longer in the list
  // above (e.g. the old placeholder set) so re-seeding doesn't leave stale
  // rows sitting alongside the current ones.
  const currentSlugs = projects.map(p => p.slug)
  const { count } = await db.project.deleteMany({
    where: { slug: { notIn: currentSlugs } },
  })
  if (count > 0) {
    console.log(`    🗑  Removed ${count} stale project(s) no longer in the seed`)
  }
}

// ─── PM Projects ───────────────────────────────────────────────────────────────

export async function seedPMProjects() {
  console.log('  📋 Seeding PM projects...')

  const pmProjects = [
    {
      id: 'cuid_pm_001',
      slug: 'pm-guidebook',
      title: 'PM Guidebook',
      tag: 'PM · Documentation · Notion',
      description:
        'Comprehensive project management reference covering Agile, Waterfall, risk registers, stakeholder mapping, and Finnish working culture practices. A practical day-to-day reference for tech project teams.',
      icon: '📖',
      year: '2024',
      linkLabel: 'Read Guidebook',
      linkUrl: null,
      order: 1,
    },
    {
      id: 'cuid_pm_002',
      slug: 'project-gantt-tool',
      title: 'Project Gantt Chart Tool',
      tag: 'PM · Interactive · TypeScript',
      description:
        'Interactive Gantt chart builder for software project teams. Supports milestone tracking, task dependencies, resource allocation, and exportable timelines. Open-sourced for the Finnish PM community.',
      icon: '📊',
      year: '2023',
      linkLabel: 'View Live',
      linkUrl: null,
      order: 2,
    },
    {
      id: 'cuid_pm_003',
      slug: 'agile-sprint-planner',
      title: 'Agile Sprint Planner',
      tag: 'PM · Planning · Notion Templates',
      description:
        'Notion-based sprint planning template system with backlog management, velocity tracking, burndown charts, and retrospective frameworks. Tailored for Finnish Agile teams and startup environments.',
      icon: '🗺️',
      year: '2024',
      linkLabel: 'Get Templates',
      linkUrl: null,
      order: 3,
    },
  ]

  for (const pm of pmProjects) {
    await db.pMProject.upsert({
      where: { slug: pm.slug },
      update: pm,
      create: pm,
    })
    console.log(`    ✓ ${pm.title}`)
  }
}
