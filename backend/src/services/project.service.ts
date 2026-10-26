/**
 * project.service.ts — Business Logic for Projects
 *
 * WHY A SERVICE LAYER?
 *   The controller's job is just to receive a request and send a response.
 *   The model's job is just to run a database query.
 *   The service is where the actual THINKING happens between those two.
 *
 *   Example of what the service adds (that neither controller nor model should do):
 *     - "If the project doesn't exist, throw a NOT_FOUND error"
 *     - "Filter out certain fields before returning"
 *     - "If category=pm, redirect to PMProjectService" (future)
 *
 *   This separation means:
 *     → You can test service logic without an HTTP request
 *     → You can reuse service methods from multiple controllers
 *     → Controllers stay clean and readable
 *
 * USAGE:
 *   import { ProjectService } from '@services/project.service'
 *   const projects = await ProjectService.getAll({ featured: true })
 */

import { ProjectModel }            from '@models/Project.model'
import { AppError, ErrorCode }     from '@app-types'
import type { ProjectDTO, ProjectQueryParams } from '@app-types'
import type { ProjectQueryInput }  from '@utils/validators'

export const ProjectService = {
  /**
   * getAll — Return all projects, optionally filtered
   * No "not found" check here — an empty array is a valid response.
   */
  async getAll(query?: ProjectQueryInput): Promise<ProjectDTO[]> {
    // Map the raw query params into the filter shape the model expects
    const filters: ProjectQueryParams = {
      featured: query?.featured,
      category: query?.category,
    }

    return ProjectModel.findAll(filters)
  },

  /**
   * getBySlug — Return one project or throw NOT_FOUND
   *
   * This is a key service responsibility:
   *   The model returns null when not found.
   *   The service converts that null into a proper AppError.
   *   The errorHandler middleware converts AppError to a 404 JSON response.
   */
  async getBySlug(slug: string): Promise<ProjectDTO> {
    const project = await ProjectModel.findBySlug(slug)

    if (!project) {
      // AppError(message, statusCode, errorCode)
      throw new AppError(
        `Project "${slug}" not found`,
        404,
        ErrorCode.NOT_FOUND
      )
    }

    return project
  },
}
