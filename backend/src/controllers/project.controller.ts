/**
 * project.controller.ts — HTTP Handlers for Project Routes
 *
 * Each method here corresponds to one route.
 * The controller's ONLY job: read request → call service → send response.
 *
 * Notice how thin each method is — no logic, just coordination.
 * All the "thinking" is in ProjectService.
 */

import type { Request, Response } from 'express'
import { ProjectService }         from '@services/project.service'
import { sendSuccess }            from '@utils/response'
import { asyncHandler }           from '@utils/asyncHandler'
import { projectQuerySchema }     from '@utils/validators'

export const ProjectController = {
  /**
   * getAll — GET /api/v1/projects
   * Optional query params: ?featured=true&category=engineering&page=1&limit=12
   */
  getAll: asyncHandler(async (req: Request, res: Response) => {
    // Parse and validate query params with Zod
    // .parse() (not .safeParse) because we want it to throw on invalid params
    // asyncHandler will catch the ZodError and forward to errorHandler
    const query = projectQuerySchema.parse(req.query)

    const projects = await ProjectService.getAll(query)

    sendSuccess(res, projects, 200, `${projects.length} projects fetched`)
  }),

  /**
   * getBySlug — GET /api/v1/projects/:slug
   * req.params.slug is the :slug URL segment
   */
  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params
    // ProjectService throws AppError(NOT_FOUND) if not found
    // asyncHandler catches it → errorHandler sends 404 JSON
    const project = await ProjectService.getBySlug(slug)

    sendSuccess(res, project)
  }),
}
