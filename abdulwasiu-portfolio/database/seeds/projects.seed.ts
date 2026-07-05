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
      id: 'cuid_project_001',
      slug: 'devconnect-hub',
      title: 'DevConnect Hub',
      tag: 'Full-Stack · React · Node.js',
      description:
        'Developer collaboration platform with real-time chat, project boards and GitHub integration. GDPR-compliant architecture deployed on AWS with 99.8% uptime SLA.',
      year: '2024',
      category: 'engineering',
      linkLabel: 'Case Study',
      linkUrl: null,
      imageUrl: null,
      featured: true,
      order: 1,
    },
    {
      id: 'cuid_project_002',
      slug: 'nordic-shop-platform',
      title: 'Nordic Shop Platform',
      tag: 'E-Commerce · Next.js · AWS',
      description:
        'Nordic e-commerce platform with a custom ML recommendation engine, multi-currency support, and real-time inventory management. Built for the Finnish market.',
      year: '2023',
      category: 'engineering',
      linkLabel: 'Case Study',
      linkUrl: null,
      imageUrl: null,
      featured: true,
      order: 2,
    },
    {
      id: 'cuid_project_003',
      slug: 'suomi-ui',
      title: 'suomi-ui Library',
      tag: 'Open Source · TypeScript',
      description:
        'Open-source Finnish design system component library implementing accessibility-first patterns. 1.2k GitHub stars, used across 30+ Finnish startups.',
      year: '2022',
      category: 'engineering',
      linkLabel: 'GitHub',
      linkUrl: 'https://github.com/abdulwasiu/suomi-ui',
      imageUrl: null,
      featured: false,
      order: 3,
    },
    {
      id: 'cuid_project_004',
      slug: 'portfolio-website',
      title: 'This Portfolio',
      tag: 'Full-Stack · React · TypeScript · Node.js',
      description:
        'This very website — a full-stack monorepo portfolio built with React, TypeScript, Express, and PostgreSQL. Features a contact form, responsive design, and PM project showcase.',
      year: '2025',
      category: 'engineering',
      linkLabel: 'GitHub',
      linkUrl: 'https://github.com/abdulwasiu/portfolio',
      imageUrl: null,
      featured: false,
      order: 4,
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
