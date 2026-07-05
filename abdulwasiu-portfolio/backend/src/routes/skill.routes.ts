/**
 * skill.routes.ts — Routes for Skills
 * Skills are read-only from the API — no create/update/delete here.
 */

import { Router }          from 'express'
import { SkillController } from '@controllers/index'

const router = Router()

// GET /api/v1/skills
// Returns all categories with their skills nested inside
router.get('/', SkillController.getAll)

export default router
