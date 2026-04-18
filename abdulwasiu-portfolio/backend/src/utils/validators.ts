/**
 * validators.ts — Zod Validation Schemas for Request Bodies
 *
 * WHAT THIS FILE DOES:
 *   Defines the expected shape of incoming request bodies using Zod.
 *   These schemas are used by the validateRequest middleware to:
 *     1. Check that required fields are present
 *     2. Check that values are the right type/format
 *     3. Strip unknown fields (safety measure)
 *     4. Attach the validated data to req.validatedBody
 *
 * ZOD SCHEMA REFRESHER:
 *   z.string()           → must be a string
 *   .min(2)              → must be at least 2 characters
 *   .max(100)            → must be at most 100 characters
 *   .email()             → must be a valid email format
 *   .trim()              → remove surrounding whitespace before validating
 *   .toLowerCase()       → convert to lowercase before validating
 *   z.boolean().optional() → may be undefined; if present, must be boolean
 *   z.enum(['a','b'])    → must be exactly 'a' or 'b'
 *
 * USAGE:
 *   import { contactSchema } from '@utils/validators'
 *   // In route: router.post('/', validateRequest(contactSchema), handler)
 */

import { z } from 'zod'

// ─── Contact Form Schema ───────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim(),

  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),

  subject: z
    .string({ required_error: 'Subject is required' })
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be at most 200 characters')
    .trim(),

  message: z
    .string({ required_error: 'Message is required' })
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must be at most 2000 characters')
    .trim(),
})

// Infer the TypeScript type from the schema — they stay in sync automatically
export type ContactSchemaInput = z.infer<typeof contactSchema>

// ─── Project Query Params Schema ───────────────────────────────────────────────
//
// For GET /projects?featured=true&category=engineering
// Query params come in as strings, so we coerce/transform them.

export const projectQuerySchema = z.object({
  featured: z
    .string()
    .transform(val => val === 'true')
    .optional(),

  category: z
    .enum(['engineering', 'pm'])
    .optional(),

  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(50).default(12).optional(),
})

export type ProjectQueryInput = z.infer<typeof projectQuerySchema>
