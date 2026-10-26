/**
 * health.routes.ts — Health Check Route
 *
 * HOW EXPRESS ROUTER WORKS:
 *   express.Router() creates a mini-app that can define its own routes.
 *   We export each router and mount them in routes/index.ts.
 *   This keeps route definitions organized and separate from app setup.
 *
 *   router.get(path, ...middlewares, handler)
 *   The middlewares run in order before the handler.
 */

import { Router }           from 'express'
import { HealthController } from '@controllers/index'

const router = Router()

// GET /api/v1/health
// No middleware needed — health check should always be accessible
router.get('/', HealthController.check)

export default router
