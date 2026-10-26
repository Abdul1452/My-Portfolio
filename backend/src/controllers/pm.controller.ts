/**
 * pm.controller.ts — HTTP Handlers for PM Project Routes
 */

import type { Request, Response } from 'express'
import { PMProjectService }        from '@services/pm.service'
import { sendSuccess }             from '@utils/response'
import { asyncHandler }            from '@utils/asyncHandler'

export const PMController = {
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const items = await PMProjectService.getAll()
    sendSuccess(res, items, 200, `${items.length} PM projects fetched`)
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params
    const item = await PMProjectService.getBySlug(slug)
    sendSuccess(res, item)
  }),
}
