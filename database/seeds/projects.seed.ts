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
      linkUrl: 'https://github.com/Abdul1452/Fraud-Detector-PetosVahti-',
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
      year: '2026',
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
      title: 'Project Management Guidebook',
      tag: 'PM · Course project · Team of 6',
      description:
        'A practical guidebook for software project teams, written by a team of six in our project management course at Turku UAS: Waterfall, Scrum and other Agile frameworks, WBS and Gantt charts, scope, risk, change and quality management, PM tools and certifications, with ready-to-use templates.',
      icon: '📖',
      year: '2026',
      linkLabel: 'Read the PDF',
      // Served by the frontend from frontend/public/docs/.
      linkUrl: '/docs/project-management-guidebook.pdf',
      order: 1,
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

  // Same clean-up as the projects above: drop rows from earlier seed runs
  // (the old placeholder Gantt tool and sprint planner) that aren't real work.
  const currentSlugs = pmProjects.map(p => p.slug)
  const { count } = await db.pMProject.deleteMany({
    where: { slug: { notIn: currentSlugs } },
  })
  if (count > 0) {
    console.log(`    🗑  Removed ${count} stale PM project(s) no longer in the seed`)
  }
}
