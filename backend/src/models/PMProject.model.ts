/**
 * PMProject.model.ts — Database Access for PM Projects
 *
 * Follows the same pattern as Project.model.ts.
 * PM projects are separate from engineering projects in the DB
 * because they have different fields (icon, no imageUrl, etc.)
 */

import { db } from '@config/database'
import type { PMProjectDTO } from '@app-types'

const PM_PROJECT_SELECT = {
  id: true,
  slug: true,
  title: true,
  tag: true,
  description: true,
  icon: true,
  year: true,
  linkLabel: true,
  linkUrl: true,
  order: true,
} as const

export const PMProjectModel = {
  async findAll(): Promise<PMProjectDTO[]> {
    const items = await db.pMProject.findMany({
      select: PM_PROJECT_SELECT,
      orderBy: { order: 'asc' },
    })
    return items as PMProjectDTO[]
  },

  async findBySlug(slug: string): Promise<PMProjectDTO | null> {
    const item = await db.pMProject.findUnique({
      where: { slug },
      select: PM_PROJECT_SELECT,
    })
    return item as PMProjectDTO | null
  },
}
