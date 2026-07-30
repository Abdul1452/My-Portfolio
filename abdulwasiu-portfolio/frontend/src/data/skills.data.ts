/**
 * skills.data.ts — Static Fallback Data for Skills
 *
 * Mirrors database/seeds/skills.seed.ts.
 * Matches the SkillCategory type (categories WITH nested skills).
 *
 * The export is named `skillCategories` — AppContext imports it as
 *   `import { skillCategories as staticSkills } from '@data/skills.data'`
 *
 * NOTE ON STRUCTURE:
 *   This is the FLATTENED / nested version the frontend uses directly:
 *   each category already contains its skills array. The backend builds
 *   this same shape via a JOIN; here we just write it out by hand.
 */

import type { SkillCategory } from '@app-types'

export const skillCategories: SkillCategory[] = [
  {
    id: 'cat_frontend',
    name: 'Frontend',
    order: 1,
    skills: [
      { id: 'skill_react',    name: 'React / Next.js', percentage: 92, order: 1 },
      { id: 'skill_ts',       name: 'TypeScript',      percentage: 90, order: 2 },
      { id: 'skill_tailwind', name: 'Tailwind CSS',    percentage: 88, order: 3 },
      { id: 'skill_figma',    name: 'Figma → Code',    percentage: 82, order: 4 },
    ],
  },
  {
    id: 'cat_backend',
    name: 'Backend',
    order: 2,
    skills: [
      { id: 'skill_node',   name: 'Node.js / Express', percentage: 88, order: 1 },
      { id: 'skill_pg',     name: 'PostgreSQL',        percentage: 85, order: 2 },
      { id: 'skill_api',    name: 'REST / GraphQL',    percentage: 90, order: 3 },
      { id: 'skill_docker', name: 'Docker / AWS',      percentage: 78, order: 4 },
    ],
  },
  {
    id: 'cat_pm',
    name: 'Project Management',
    order: 3,
    skills: [
      { id: 'skill_agile', name: 'Agile / Scrum',     percentage: 90, order: 1 },
      { id: 'skill_risk',  name: 'Risk Management',   percentage: 82, order: 2 },
      { id: 'skill_gantt', name: 'Gantt & Roadmaps',  percentage: 85, order: 3 },
      { id: 'skill_stake', name: 'Stakeholder Comms', percentage: 88, order: 4 },
    ],
  },
  {
    id: 'cat_tools',
    name: 'Tools & Standards',
    order: 4,
    skills: [
      { id: 'skill_gdpr', name: 'GDPR Compliance',   percentage: 80, order: 1 },
      { id: 'skill_wcag', name: 'WCAG Accessibility', percentage: 80, order: 2 },
      { id: 'skill_cicd', name: 'CI/CD Pipelines',   percentage: 82, order: 3 },
      { id: 'skill_git',  name: 'Git / GitHub',      percentage: 95, order: 4 },
    ],
  },
]
