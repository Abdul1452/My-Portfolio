/**
 * rateLimit.ts — Rate Limiting Middleware
 *
 * WHAT IS RATE LIMITING?
 *   Limiting how many requests a single IP can make in a time window.
 *   Without it, someone could spam your /contact endpoint 10,000 times,
 *   flooding your email inbox and your database.
 *
 * TWO LIMITERS:
 *   - globalLimiter: applies to ALL routes (prevents general abuse)
 *   - contactLimiter: stricter limit ONLY on POST /contact (prevents spam)
 */

import rateLimit from 'express-rate-limit'
import { env } from '@config/env'
import { sendError } from '@utils/response'
import { ErrorCode } from '@app-types'

// Applied to all API routes
export const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // Time window (default: 15 min)
  max: env.RATE_LIMIT_MAX, // Max requests per window per IP
  standardHeaders: true, // Send standard RateLimit-* headers in response
  legacyHeaders: false, // Don't send old X-RateLimit-* headers

  // Custom handler so the response uses our standard error format
  handler: (_req, res) => {
    sendError(res, 'Too many requests. Please slow down.', 429, ErrorCode.RATE_LIMITED)
  },
})

// Applied only to POST /contact — much stricter
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // Only 5 contact submissions per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(
      res,
      'You have sent too many messages. Please wait an hour before trying again.',
      429,
      ErrorCode.RATE_LIMITED
    )
  },
})
