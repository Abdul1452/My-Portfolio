/**
 * apiVersion.ts — API Version Response Headers
 *
 * WHAT THIS FILE DOES:
 *   Returns a middleware that labels every response from one API version
 *   with headers telling the client which version answered, and — once a
 *   version is being retired — when it was deprecated and when it will stop
 *   working.
 *
 * HEADERS IT SETS:
 *   API-Version: v1
 *     Always. Lets a client (or you, in DevTools) confirm which version
 *     handled the request.
 *
 *   Deprecation: @1798761600            (RFC 9745)
 *     Only when `deprecatedAt` is given. The value is "@" + a Unix timestamp
 *     in seconds: the moment this version became deprecated.
 *
 *   Sunset: Thu, 01 Jul 2027 00:00:00 GMT   (RFC 8594)
 *     Only when `sunsetAt` is given. After this date the version may be
 *     removed and its URLs will return 404.
 *
 *   Link: <https://…>; rel="deprecation"
 *     Only when `docsUrl` is given. Points to the migration guide.
 *
 * USAGE (in routes/index.ts):
 *   router.use('/v1', apiVersion('v1'), v1Router)
 *
 *   // Later, when v2 ships and v1 is on its way out:
 *   router.use('/v1', apiVersion('v1', {
 *     deprecatedAt: new Date('2027-01-01'),
 *     sunsetAt:     new Date('2027-07-01'),
 *     docsUrl:      'https://abdulwasiu.dev/docs/api/v1-to-v2',
 *   }), v1Router)
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express'
import type { ApiVersion } from '@config/api'

export interface ApiVersionOptions {
  deprecatedAt?: Date // When this version was deprecated
  sunsetAt?: Date     // When this version will be removed
  docsUrl?: string    // Migration guide for clients
}

export function apiVersion(
  version: ApiVersion,
  options: ApiVersionOptions = {}
): RequestHandler {
  const { deprecatedAt, sunsetAt, docsUrl } = options

  // Work the header values out once, when the router is built,
  // instead of on every request.
  const deprecationHeader = deprecatedAt
    ? `@${Math.floor(deprecatedAt.getTime() / 1000)}`
    : undefined
  const sunsetHeader = sunsetAt ? sunsetAt.toUTCString() : undefined
  const linkHeader = docsUrl ? `<${docsUrl}>; rel="deprecation"` : undefined

  return (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('API-Version', version)
    if (deprecationHeader) res.setHeader('Deprecation', deprecationHeader)
    if (sunsetHeader)      res.setHeader('Sunset', sunsetHeader)
    if (linkHeader)        res.setHeader('Link', linkHeader)
    next()
  }
}
