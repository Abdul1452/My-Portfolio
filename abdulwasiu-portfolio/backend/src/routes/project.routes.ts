/**
 * project.routes.ts — Routes for Engineering Projects
 *
 * ROUTE ANATOMY:
 *   router.get(path, ...middlewares, handler)
 *
 *   path        → URL pattern, relative to wherever this router is mounted
 *                 Mounted at /api/v1/projects in routes/index.ts
 *                 So '/'     matches  GET /api/v1/projects
 *                 And '/:slug' matches  GET /api/v1/projects/devconnect-hub
 *
 *   :slug       → A URL parameter. Express captures whatever is in that
 *                 position and puts it in req.params.slug
 *                 GET /api/v1/projects/devconnect-hub
 *                 → req.params = { slug: "devconnect-hub" }
 *
 *   middlewares → Run in ORDER before the controller.
 *                 If any middleware calls next(err), the controller is skipped
 *                 and the error falls through to errorHandler.
 */

import { Router }             from 'express'
import { ProjectController }  from '@controllers/index'

const router = Router()

// GET /api/v1/projects
// Optional query params: ?featured=true&category=engineering&page=1&limit=12
// No auth needed — projects are public
router.get('/', ProjectController.getAll)

// GET /api/v1/projects/:slug
// e.g. GET /api/v1/projects/devconnect-hub
router.get('/:slug', ProjectController.getBySlug)

export default router
