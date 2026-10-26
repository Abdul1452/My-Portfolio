/**
 * pm.service.ts — Business Logic for PM Projects
 * Same pattern as project.service.ts but for PM deliverables.
 */

import { PMProjectModel }         from '@models/PMProject.model'
import { AppError, ErrorCode }    from '@app-types'
import type { PMProjectDTO }      from '@app-types'

export const PMProjectService = {
  async getAll(): Promise<PMProjectDTO[]> {
    return PMProjectModel.findAll()
  },

  async getBySlug(slug: string): Promise<PMProjectDTO> {
    const item = await PMProjectModel.findBySlug(slug)

    if (!item) {
      throw new AppError(
        `PM project "${slug}" not found`,
        404,
        ErrorCode.NOT_FOUND
      )
    }

    return item
  },
}
