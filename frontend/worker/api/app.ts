/**
 * app.ts — The portfolio API, running inside the Cloudflare Worker
 *
 * The Cloudflare version of backend/ (Express + Prisma + Postgres), now
 * Hono + Drizzle + D1. Same URLs, same JSON shapes, so the frontend didn't
 * have to change:
 *
 *   GET  /api/v1/health
 *   GET  /api/v1/projects            ?featured=true  ?category=engineering|pm
 *   GET  /api/v1/projects/:slug
 *   GET  /api/v1/pm-projects
 *   GET  /api/v1/pm-projects/:slug
 *   GET  /api/v1/skills
 *   POST /api/v1/contact             { name, email, subject, message }
 *
 * RESPONSE SHAPES (unchanged from Express):
 *   success  { data, message? }
 *   error    { error, code, issues? }   issues = [{ field, message }] on 422
 *
 * Every response carries API-Version: v1 (see backend/src/middleware/apiVersion.ts
 * for how Deprecation/Sunset headers would be added when v2 ships).
 *
 * The site and the API share one origin, so no CORS is needed: browsers
 * only call it from the site itself.
 */

import { Hono, type Context } from 'hono'
import { and, asc, eq, type SQL } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { z, type ZodError } from 'zod'
import { contacts, pmProjects, projects, skillCategories, skills } from './db/schema'

type App = { Bindings: Env }
type ErrorCode = 'NOT_FOUND' | 'BAD_REQUEST' | 'VALIDATION_ERROR' | 'RATE_LIMITED' | 'PAYLOAD_TOO_LARGE' | 'INTERNAL_ERROR'

// Content changes only on deploy/seed: let browsers and the edge reuse it
// for 5 minutes. Contact responses are never cached.
const CONTENT_CACHE = 'public, max-age=300'
const MAX_CONTACT_BYTES = 10_000

// ─── Helpers ──────────────────────────────────────────────────────────────────

function apiError(c: Context<App>, status: 400 | 404 | 413 | 415 | 422 | 429 | 500, error: string, code: ErrorCode, issues?: { field: string; message: string }[]) {
  return c.json({ error, code, ...(issues && { issues }) }, status)
}

function validationError(c: Context<App>, err: ZodError) {
  const issues = err.issues.map(issue => ({ field: issue.path.join('.'), message: issue.message }))
  return apiError(c, 422, 'Validation failed', 'VALIDATION_ERROR', issues)
}

/**
 * "Hello <b>x</b>" → "Hello x". Zod checks the shape; this cleans the content.
 *
 * A character scan, the same as backend/src/utils/sanitize.ts, not a regex
 * replace: a single regex pass can leave pieces that join back into a tag
 * ("<scr<script>ipt>"). Here everything from "<" to the next ">" is dropped
 * and the brackets themselves never reach the output, so no tag can survive.
 */
function stripHtml(value: string): string {
  let clean = ''
  let insideTag = false
  for (const char of value) {
    if (char === '<') {
      insideTag = true
      continue
    }
    if (char === '>') {
      insideTag = false
      continue
    }
    if (!insideTag) clean += char
  }
  return clean.trim()
}

// Only the public fields: never created_at/updated_at or future internal columns.
const projectFields = {
  id: projects.id, slug: projects.slug, title: projects.title, tag: projects.tag,
  description: projects.description, year: projects.year, category: projects.category,
  linkLabel: projects.linkLabel, linkUrl: projects.linkUrl, imageUrl: projects.imageUrl,
  featured: projects.featured, order: projects.order,
}
const pmProjectFields = {
  id: pmProjects.id, slug: pmProjects.slug, title: pmProjects.title, tag: pmProjects.tag,
  description: pmProjects.description, icon: pmProjects.icon, year: pmProjects.year,
  linkLabel: pmProjects.linkLabel, linkUrl: pmProjects.linkUrl, order: pmProjects.order,
}

// ─── Validation (same rules as backend/src/utils/validators.ts) ───────────────

const projectQuery = z.object({
  featured: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  category: z.enum(['engineering', 'pm']).optional(),
})

const contactSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim()
    .min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  email: z.string({ required_error: 'Email is required' }).trim().toLowerCase()
    .email('Please enter a valid email address'),
  subject: z.string({ required_error: 'Subject is required' }).trim()
    .min(5, 'Subject must be at least 5 characters').max(200, 'Subject must be at most 200 characters'),
  message: z.string({ required_error: 'Message is required' }).trim()
    .min(20, 'Message must be at least 20 characters').max(2000, 'Message must be at most 2000 characters'),
})

// ─── Routes: v1 ───────────────────────────────────────────────────────────────

const v1 = new Hono<App>()

v1.use(async (c, next) => {
  await next()
  c.header('API-Version', 'v1')
})

v1.get('/health', c => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

v1.get('/projects', async c => {
  const query = projectQuery.safeParse(c.req.query())
  if (!query.success) return validationError(c, query.error)

  const filters: SQL[] = []
  if (query.data.featured !== undefined) filters.push(eq(projects.featured, query.data.featured))
  if (query.data.category) filters.push(eq(projects.category, query.data.category))

  const rows = await drizzle(c.env.DB)
    .select(projectFields).from(projects)
    .where(and(...filters))
    .orderBy(asc(projects.order))
  c.header('Cache-Control', CONTENT_CACHE)
  return c.json({ data: rows })
})

v1.get('/projects/:slug', async c => {
  const [row] = await drizzle(c.env.DB).select(projectFields).from(projects)
    .where(eq(projects.slug, c.req.param('slug'))).limit(1)
  if (!row) return apiError(c, 404, 'Project not found', 'NOT_FOUND')
  c.header('Cache-Control', CONTENT_CACHE)
  return c.json({ data: row })
})

v1.get('/pm-projects', async c => {
  const rows = await drizzle(c.env.DB).select(pmProjectFields).from(pmProjects).orderBy(asc(pmProjects.order))
  c.header('Cache-Control', CONTENT_CACHE)
  return c.json({ data: rows })
})

v1.get('/pm-projects/:slug', async c => {
  const [row] = await drizzle(c.env.DB).select(pmProjectFields).from(pmProjects)
    .where(eq(pmProjects.slug, c.req.param('slug'))).limit(1)
  if (!row) return apiError(c, 404, 'PM project not found', 'NOT_FOUND')
  c.header('Cache-Control', CONTENT_CACHE)
  return c.json({ data: row })
})

// Categories with their skills nested, both in their manual order.
v1.get('/skills', async c => {
  const db = drizzle(c.env.DB)
  const [categoryRows, skillRows] = await Promise.all([
    db.select({ id: skillCategories.id, name: skillCategories.name, order: skillCategories.order })
      .from(skillCategories).orderBy(asc(skillCategories.order)),
    db.select({ id: skills.id, name: skills.name, percentage: skills.percentage, order: skills.order, categoryId: skills.categoryId })
      .from(skills).orderBy(asc(skills.order)),
  ])
  const data = categoryRows.map(category => ({
    ...category,
    skills: skillRows
      .filter(skill => skill.categoryId === category.id)
      .map(({ categoryId: _categoryId, ...skill }) => skill),
  }))
  c.header('Cache-Control', CONTENT_CACHE)
  return c.json({ data })
})

v1.post('/contact', async c => {
  c.header('Cache-Control', 'no-store')

  // 1. Rate limit per visitor (Workers Rate Limiting binding, 5/min).
  const visitor = c.req.header('CF-Connecting-IP') ?? 'unknown'
  const { success } = await c.env.CONTACT_LIMITER.limit({ key: visitor })
  if (!success) return apiError(c, 429, 'Too many messages. Please wait a minute and try again.', 'RATE_LIMITED')

  // 2. Only small JSON bodies.
  if (!c.req.header('Content-Type')?.includes('application/json')) {
    return apiError(c, 415, 'Send the form as JSON.', 'BAD_REQUEST')
  }
  const raw = await c.req.text()
  if (raw.length > MAX_CONTACT_BYTES) return apiError(c, 413, 'Message is too large.', 'PAYLOAD_TOO_LARGE')
  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return apiError(c, 400, 'Invalid JSON in request body', 'BAD_REQUEST')
  }

  // 3. Validate, then strip any HTML before it's stored.
  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) return validationError(c, parsed.error)
  const input = {
    name: stripHtml(parsed.data.name),
    email: parsed.data.email,
    subject: stripHtml(parsed.data.subject),
    message: stripHtml(parsed.data.message),
  }

  // 4. Save. E-mail notification comes later, with a domain (Email Routing).
  const [saved] = await drizzle(c.env.DB).insert(contacts).values(input).returning({
    id: contacts.id, name: contacts.name, email: contacts.email, subject: contacts.subject, createdAt: contacts.createdAt,
  })
  return c.json({ data: saved, message: 'Thanks! Your message has been received.' }, 201)
})

// ─── App ──────────────────────────────────────────────────────────────────────

export const api = new Hono<App>().basePath('/api')

api.route('/v1', v1)

api.notFound(c => apiError(c, 404, 'Route not found', 'NOT_FOUND'))

// Never leak internals: log the real error, answer with a generic message.
api.onError((err, c) => {
  console.error('[api] Unhandled error', err)
  return apiError(c, 500, 'Something went wrong. Please try again later.', 'INTERNAL_ERROR')
})
