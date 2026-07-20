/**
 * pm-projects.data.ts — Static Fallback Data for PM Projects
 *
 * Mirrors backend/database/seeds/projects.seed.ts (the PM section).
 * Matches the PMProject type. Used by AppContext when the API is offline.
 *
 * NOTE: The export is named `pmProjects` — AppContext imports it as
 *   `import { pmProjects as staticPMProjects } from '@data/pm-projects.data'`
 *   The name MUST match or the import breaks.
 */

import type { PMProject } from '@types'

export const pmProjects: PMProject[] = [
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
