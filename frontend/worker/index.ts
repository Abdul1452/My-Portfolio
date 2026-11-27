/**
 * worker/index.ts — The Cloudflare Worker in front of the site
 *
 * Only requests to /files/* and /api/* reach this code (see run_worker_first
 * in wrangler.jsonc). Everything else — the React app, its JS/CSS, images in
 * public/ — is served straight from Cloudflare's asset store.
 *
 * /files/<key>  streams an object from the private R2 bucket (FILES), e.g.
 *               /files/docs/project-management-guidebook.pdf
 *               - only GET/HEAD, only keys under an allowed folder
 *               - supports Range requests: PDF viewers load big files in
 *                 chunks, so the first page shows before the rest arrives
 *               - supports If-None-Match, so a browser that has the file
 *                 gets a tiny 304 instead of the whole file again
 *               - GETs are kept in Cloudflare's edge cache for a day
 * /api/*        the portfolio API (Hono + Drizzle + D1), see api/app.ts
 */

import { api } from './api/app'

// Top-level folders in the bucket the site may serve. Anything else (or a
// path trying to climb out with "..") is a 404, so an object uploaded to the
// wrong place is never exposed by accident.
const ALLOWED_FOLDERS = ['docs', 'certificates', 'images']
const KEY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*(?:\/[A-Za-z0-9][A-Za-z0-9._-]*)+$/

const ONE_DAY = 60 * 60 * 24

function fileKey(pathname: string): string | null {
  let key: string
  try {
    key = decodeURIComponent(pathname.slice('/files/'.length))
  } catch {
    return null // malformed %-encoding
  }
  if (!KEY_PATTERN.test(key) || key.includes('..')) return null
  return ALLOWED_FOLDERS.includes(key.split('/')[0]) ? key : null
}

function notFound(): Response {
  return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}

/** "bytes 0-1023/52000" for a 206 response. */
function contentRange(range: R2Range, size: number): string {
  // R2 can return { offset, length, suffix: undefined }, so test the value,
  // not just whether the key exists.
  const { offset, length, suffix } = range as { offset?: number; length?: number; suffix?: number }
  if (suffix !== undefined) return `bytes ${size - suffix}-${size - 1}/${size}`
  const start = offset ?? 0
  const end = length !== undefined ? start + length - 1 : size - 1
  return `bytes ${start}-${end}/${size}`
}

async function serveFile(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } })
  }

  const key = fileKey(new URL(request.url).pathname)
  if (!key) return notFound()

  // Whole-file GETs can come from the edge cache; ranged ones go to R2.
  const cacheable = request.method === 'GET' && !request.headers.has('Range')
  const cache = caches.default
  if (cacheable) {
    const cached = await cache.match(request)
    if (cached) return cached
  }

  // Passing the request headers lets R2 apply Range and If-None-Match itself.
  const object = await env.FILES.get(key, { range: request.headers, onlyIf: request.headers })
  if (!object) return notFound()

  const headers = new Headers()
  object.writeHttpMetadata(headers) // Content-Type etc. stored with the object
  headers.set('ETag', object.httpEtag)
  headers.set('Accept-Ranges', 'bytes')
  headers.set('Cache-Control', `public, max-age=${ONE_DAY}`)
  headers.set('X-Content-Type-Options', 'nosniff')

  // onlyIf matched (the browser's copy is current): R2 returns no body.
  if (!('body' in object)) return new Response(null, { status: 304, headers })

  if (object.range && request.headers.has('Range')) {
    headers.set('Content-Range', contentRange(object.range, object.size))
    return new Response(request.method === 'HEAD' ? null : object.body, { status: 206, headers })
  }

  headers.set('Content-Length', String(object.size))
  const response = new Response(request.method === 'HEAD' ? null : object.body, { headers })
  if (cacheable) ctx.waitUntil(cache.put(request, response.clone()))
  return response
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const { pathname } = new URL(request.url)

    if (pathname.startsWith('/files/')) return serveFile(request, env, ctx)

    if (pathname.startsWith('/api/')) return api.fetch(request, env, ctx)

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
