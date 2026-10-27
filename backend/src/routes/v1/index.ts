/**
 * routes/v1/index.ts — Version 1 Router
 *
 * WHAT THIS FILE DOES:
 *   Creates the v1 router and mounts each resource's sub-router under its
 *   own path prefix. routes/index.ts mounts this whole router at /v1, and
 *   app.ts mounts that at /api — together giving /api/v1/<resource>.
 *
 *   Everything in this folder is the v1 CONTRACT. Once clients depend on it,
 *   don't make breaking changes here (renaming/removing fields or URLs) —
 *   those belong in a new routes/v2/. See docs/api/versioning.md.
 *
 * HOW MOUNTING WORKS:
 *   router.use('/projects', projectRouter)
 *
 *   This means: "For any request whose URL starts with /projects,
 *   hand it off to projectRouter."
 *
 *   projectRouter then sees a STRIPPED path:
 *     Incoming:  GET /projects/devconnect-hub
 *     projectRouter sees: GET /devconnect-hub   (the /projects prefix is gone)
 *   That's why inside project.routes.ts we write '/:slug' not '/projects/:slug'.
 *
 * FULL URL MAP:
 *   GET  /api/v1/health             → health.routes.ts
 *   GET  /api/v1/projects           → project.routes.ts
 *   GET  /api/v1/projects/:slug     → project.routes.ts
 *   GET  /api/v1/pm-projects        → pm.routes.ts
 *   GET  /api/v1/pm-projects/:slug  → pm.routes.ts
 *   GET  /api/v1/skills             → skill.routes.ts
 *   POST /api/v1/contact            → contact.routes.ts
 */

import { Router } from 'express'
import healthRoutes  from './health.routes'
import projectRoutes from './project.routes'
import pmRoutes      from './pm.routes'
import skillRoutes   from './skill.routes'
import contactRoutes from './contact.routes'

const router = Router()

// Mount each sub-router under its path prefix.
// Requests to /health, /projects, etc. are delegated to the matching router.
router.use('/health',      healthRoutes)
router.use('/projects',    projectRoutes)
router.use('/pm-projects', pmRoutes)
router.use('/skills',      skillRoutes)
router.use('/contact',     contactRoutes)

export default router
