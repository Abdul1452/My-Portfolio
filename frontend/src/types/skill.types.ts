/**
 * skill.types.ts — Skill & Category Types (Frontend)
 *
 * The backend returns categories with their skills NESTED inside
 * (see backend SkillModel.findAllWithCategories).
 * So a SkillCategory contains an array of Skill objects.
 *
 * This "has many" relationship is expressed by the `skills: Skill[]` field.
 */

export interface Skill {
  id: string
  name: string        // "React / Next.js"
  percentage: number  // 0-100 proficiency
  order: number
}

export interface SkillCategory {
  id: string
  name: string        // "Frontend", "Backend", "Project Management"
  order: number
  skills: Skill[]     // The skills belonging to this category
}
