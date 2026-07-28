/**
 * Project.model.ts — Database Access for Projects
 *
 * WHAT IS A MODEL?
 *   The Model is the ONLY layer that talks directly to the database.
 *   It wraps Prisma calls and returns data in a consistent shape.
 *
 * WHY WRAP PRISMA AT ALL?
 *   You could call db.project.findMany() directly in a service or controller.
 *   But wrapping it gives you:
 *     1. ONE place to change if your query logic needs to update
 *     2. Easy to mock in tests (replace the model, not Prisma itself)
 *     3. Select only the fields you need (don't leak internal DB fields)
 *     4. Apply consistent defaults (ordering, filtering) in one place
 *
 * PRISMA QUICK REFERENCE:
 *   db.project.findMany({ where, orderBy, select })  → returns array
 *   db.project.findUnique({ where: { slug } })       → returns one or null
 *   db.project.create({ data })                      → creates and returns record
 *   db.project.update({ where, data })               → updates and returns record
 *   db.project.delete({ where })                     → deletes
 *
 * USAGE:
 *   import { ProjectModel } from '@models/Project.model'
 *   const projects = await ProjectModel.findAll({ featured: true })
 */

import { db } from '@config/database'
import type { ProjectQueryParams, ProjectDTO } from '@app-types'

// The SELECT object tells Prisma exactly which columns to fetch.
// This is a security and performance best practice:
//   - You never accidentally expose fields added to the DB later
//   - You don't fetch data you don't need (e.g., internal audit fields)
const PROJECT_SELECT = {
  id: true,
  slug: true,
  title: true,
  tag: true,
  description: true,
  year: true,
  category: true,
  linkLabel: true,
  linkUrl: true,
  imageUrl: true,
  featured: true,
  order: true,
  // Deliberately NOT selecting: createdAt, updatedAt (internal fields)
} as const
// `as const` freezes the object so TypeScript infers the exact literal types

export const ProjectModel = {
  /**
   * findAll — Fetch all projects, optionally filtered
   *
   * @param filters - Optional featured flag and category filter
   * @returns Array of ProjectDTO objects, ordered by `order` field ascending
   */
  async findAll(filters?: ProjectQueryParams): Promise<ProjectDTO[]> {
    // Build the `where` clause dynamically based on what filters were passed.
    // If filters.featured is undefined, we don't include it in the WHERE clause.
    // Prisma ignores undefined values in where objects — very convenient.
    const where = {
      ...(filters?.featured !== undefined && { featured: filters.featured }),
      ...(filters?.category && { category: filters.category }),
      // Spread syntax: { ...{ featured: true } } → { featured: true }
      //                { ...undefined }           → {}  (nothing added)
    }

    const projects = await db.project.findMany({
      where,
      select: PROJECT_SELECT,
      orderBy: { order: 'asc' }, // Manual sort order from the DB
    })

    // Cast to ProjectDTO[] — the select above guarantees the shape matches
    return projects as ProjectDTO[]
  },

  /**
   * findBySlug — Fetch a single project by its URL slug
   *
   * @param slug - e.g. "devconnect-hub"
   * @returns ProjectDTO if found, null if not
   */
  async findBySlug(slug: string): Promise<ProjectDTO | null> {
    const project = await db.project.findUnique({
      where: { slug },
      select: PROJECT_SELECT,
    })

    // findUnique returns null if not found — we propagate that.
    // The service layer decides what to do with null (usually throw AppError NOT_FOUND).
    return project as ProjectDTO | null
  },
}
