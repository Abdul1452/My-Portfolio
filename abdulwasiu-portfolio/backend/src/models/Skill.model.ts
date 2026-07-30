/**
 * Skill.model.ts — Database Access for Skills
 *
 * Skills live in two related tables:
 *   skill_categories (Frontend, Backend, PM, Tools)
 *   skills           (React 92%, TypeScript 90%, ...)
 *
 * Each skill BELONGS TO a category (foreign key: categoryId).
 * Each category HAS MANY skills.
 *
 * PRISMA RELATIONS:
 *   Prisma uses `include` to fetch related records in a single query.
 *   Without include:
 *     db.skillCategory.findMany() → returns categories WITHOUT skills
 *   With include:
 *     db.skillCategory.findMany({ include: { skills: true } })
 *     → returns categories WITH their skills nested inside
 *
 *   This is similar to a SQL JOIN but Prisma handles it automatically.
 */

import { db } from '@config/database'

// The shape we return — categories with their skills nested
export interface SkillCategoryWithSkills {
  id: string
  name: string
  order: number
  skills: Array<{
    id: string
    name: string
    percentage: number
    order: number
  }>
}

export const SkillModel = {
  /**
   * findAllWithCategories
   * Returns all skill categories, each with their skills sorted by order.
   */
  async findAllWithCategories(): Promise<SkillCategoryWithSkills[]> {
    const categories = await db.skillCategory.findMany({
      orderBy: { order: 'asc' },

      select: {
        id: true,
        name: true,
        order: true,
        skills: {
          // We can orderBy on the nested relation too
          orderBy: { order: 'asc' },
          select: {
            id: true,
            name: true,
            percentage: true,
            order: true,
            // Deliberately NOT selecting categoryId (internal FK)
          },
        },
      },
    })

    return categories
  },
}
