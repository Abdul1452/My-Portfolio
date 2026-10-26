/**
 * skill.controller.ts — HTTP Handlers for Skill Routes
 */

import type { Request, Response } from 'express'
import { SkillService }            from '@services/skill.service'
import { sendSuccess }             from '@utils/response'
import { asyncHandler }            from '@utils/asyncHandler'

export const SkillController = {
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await SkillService.getAll()
    sendSuccess(res, categories)
  }),
}
