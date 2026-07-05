/**
 * pm.routes.ts — Routes for Project Management Deliverables
 * Same pattern as project.routes.ts — two public GET endpoints.
 */

import { Router }    from 'express'
import { PMController } from '@controllers/index'

const router = Router()

// GET /api/v1/pm-projects
router.get('/', PMController.getAll)

// GET /api/v1/pm-projects/:slug
// e.g. GET /api/v1/pm-projects/pm-guidebook
router.get('/:slug', PMController.getBySlug)

export default router
