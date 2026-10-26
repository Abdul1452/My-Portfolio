/**
 * data/index.ts — Barrel Export for all static data
 *
 * Lets components import any static data from one place:
 *   import { projects, skillCategories, siteMeta } from '@data'
 *
 * Note: AppContext imports directly from the individual files (not this
 * barrel) to keep its fallback imports explicit. Components can use either.
 */

export { projects } from './projects.data'
export { pmProjects } from './pm-projects.data'
export { skillCategories } from './skills.data'

export { experience } from './experience.data'
export type { ExperienceItem } from './experience.data'

export {
  siteMeta,
  heroStats,
  heroTechStack,
  aboutFacts,
} from './meta.data'
export type { SiteMeta, HeroStat, AboutFact } from './meta.data'
