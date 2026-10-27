/**
 * contact.routes.ts — Routes for Contact Form
 *
 * This is the most middleware-heavy route because:
 *   1. contactLimiter  → max 5 submissions per hour per IP (spam prevention)
 *   2. validateRequest → validates the request body with Zod before the
 *                        controller even runs
 *
 * MIDDLEWARE EXECUTION ORDER (left to right on the same router.post() call):
 *   contactLimiter → validateRequest(contactSchema) → ContactController.submit
 *
 *   Step 1: contactLimiter checks the IP — too many? 429 response. Done.
 *   Step 2: validateRequest parses req.body against contactSchema.
 *           Invalid? 422 response with field errors. Done.
 *   Step 3: Controller runs — body is guaranteed valid at this point.
 *
 * This layered approach is the key security pattern for write endpoints.
 */

import { Router }             from 'express'
import { ContactController }  from '@controllers/index'
import { contactLimiter }     from '@middleware/rateLimit'
import { validateRequest }    from '@middleware/validateRequest'
import { contactSchema }      from '@utils/validators'

const router = Router()

// POST /api/v1/contact
// Three middleware run in order before the controller:
router.post(
  '/',
  contactLimiter,                    // 1. Rate limit: max 5/hour per IP
  validateRequest(contactSchema),    // 2. Validate body shape with Zod
  ContactController.submit           // 3. Save + email (only if 1 & 2 passed)
)

export default router
