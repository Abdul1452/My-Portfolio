/**
 * routes/index.ts — API Version Registry
 *
 * WHAT THIS FILE DOES:
 *   Mounts each API version's router under its own path segment, and
 *   answers requests that don't name a supported version.
 *   app.ts mounts this router at API_BASE_PATH (/api).
 *
 * FOLDER LAYOUT:
 *   routes/
 *   ├── index.ts        ← you are here: picks the version
 *   └── v1/
 *       ├── index.ts    ← picks the resource within v1
 *       └── *.routes.ts ← the actual endpoints
 *
 * WHAT GOES TO WHICH HANDLER:
 *   GET /api                → discovery: lists supported versions
 *   ANY /api/v1/...         → routes/v1 (response gets an API-Version: v1 header)
 *   ANY /api/v1/nope        → v1 router doesn't match → global 404 (NOT_FOUND)
 *   ANY /api/v9/...         → 404 UNSUPPORTED_API_VERSION
 *   ANY /api/projects       → 404 UNSUPPORTED_API_VERSION ("projects" isn't a version)
 *
 * WHEN DO WE NEED A v2?
 *   Only for a BREAKING change — removing or renaming a field, changing a
 *   field's type, or changing what a URL means. Adding a new endpoint or a
 *   new optional field is NOT breaking and goes straight into v1.
 *   See docs/api/versioning.md for the full policy.
 *
 * ADDING v2 (when the time comes):
 *   1. Add 'v2' to API_VERSIONS in config/api.ts
 *   2. Create routes/v2/ (copy only the routes that change; re-use the rest)
 *   3. Mount it below:  router.use('/v2', apiVersion('v2'), v2Router)
 *   4. Mark v1 deprecated via apiVersion('v1', { deprecatedAt, sunsetAt })
 */

import { Router, type Request, type Response, type NextFunction } from 'express'
import {
  API_BASE_PATH,
  API_VERSIONS,
  LATEST_API_VERSION,
  isApiVersion,
} from '@config/api'
import { apiVersion } from '@middleware/apiVersion'
import { AppError, ErrorCode } from '@app-types'
import { sendSuccess } from '@utils/response'
import v1Router from './v1'

const router = Router()

// ─── GET /api — version discovery ────────────────────────────────────────────
//
// Lets a client (or a curious human) find out which versions exist without
// reading the docs:
//   { "data": { "latest": "v1", "versions": [{ "version": "v1", "path": "/api/v1" }] } }

router.get('/', (_req: Request, res: Response) => {
  sendSuccess(res, {
    latest: LATEST_API_VERSION,
    versions: API_VERSIONS.map(version => ({
      version,
      path: `${API_BASE_PATH}/${version}`,
    })),
  })
})

// ─── Versioned routers ───────────────────────────────────────────────────────
//
// apiVersion('v1') runs first and stamps the API-Version header, then the
// request continues into the v1 router with the /v1 prefix stripped.

router.use('/v1', apiVersion('v1'), v1Router)

// ─── Unsupported version ─────────────────────────────────────────────────────
//
// Reached when nothing above handled the request. Two cases:
//   a) The first segment IS a supported version but the v1 router had no
//      matching route (e.g. /api/v1/nope). That's an ordinary 404, so pass
//      it on to the global 404 handler in app.ts.
//   b) The first segment is NOT a supported version (/api/v9/..., or a
//      forgotten version like /api/projects). Say so explicitly, so the
//      client learns which versions do exist.

router.use('/:version', (req: Request, _res: Response, next: NextFunction) => {
  const { version } = req.params

  if (isApiVersion(version)) {
    next()
    return
  }

  next(new AppError(
    `API version '${version}' is not supported. ` +
      `Supported versions: ${API_VERSIONS.join(', ')}`,
    404,
    ErrorCode.UNSUPPORTED_API_VERSION
  ))
})

export default router
