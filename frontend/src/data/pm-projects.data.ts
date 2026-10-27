/**
 * pm-projects.data.ts — Static Fallback Data for PM Projects
 *
 * Mirrors database/seeds/projects.seed.ts (the PM section).
 * Matches the PMProject type. Used by AppContext when the API is offline.
 *
 * NOTE: The export is named `pmProjects` — AppContext imports it as
 *   `import { pmProjects as staticPMProjects } from '@data/pm-projects.data'`
 *   The name MUST match or the import breaks.
 */

import type { PMProject } from '@app-types'

export const pmProjects: PMProject[] = [
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
    // Served from frontend/public/docs/.
    linkUrl: '/docs/project-management-guidebook.pdf',
    order: 1,
  },
]
