/**
 * auth.ts — JWT Authentication Middleware
 *
 * WHAT IS JWT?
 *   JWT = JSON Web Token. A compact, self-contained way to securely
 *   transmit information between parties as a signed string.
 *
 *   A JWT looks like this (three Base64 parts separated by dots):
 *     eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMifQ.SomeSignature
 *     │── Header ────────│ │── Payload ─────────│ │── Signature ─│
 *
 *   Header:    algorithm used to sign ("HS256")
 *   Payload:   data you embedded (userId, role, expiry)
 *   Signature: HMAC of header+payload using your JWT_SECRET
 *              → proves the token wasn't tampered with
 *
 * HOW AUTH WORKS:
 *   1. User logs in → server creates a JWT signed with JWT_SECRET → sends to client
 *   2. Client stores JWT (usually in memory or httpOnly cookie)
 *   3. Client sends JWT in every request: Authorization: Bearer <token>
 *   4. Server verifies signature → if valid, trusts the payload → allows access
 *
 * WHY THIS FILE EXISTS:
 *   The portfolio doesn't have a public login page, but you might want
 *   a private admin endpoint later to manage projects from a dashboard.
 *   This middleware protects those routes.
 *
 * USAGE:
 *   router.get('/admin/contacts', requireAuth, contactController.listAll)
 *   // Only requests with a valid JWT token can reach the handler
 */

import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '@config/env'
import { AppError, ErrorCode } from '@types/index'

// ─── JWT Payload shape ────────────────────────────────────────────────────────
//
// What we embed inside the token. Keep it minimal — tokens are sent on
// every request, so large payloads slow things down.

interface JwtPayload {
  userId: string
  role: 'admin'
  iat: number   // "issued at" — Unix timestamp (added automatically by jwt.sign)
  exp: number   // "expires at" — Unix timestamp (added when you set expiresIn)
}

// ─── Augment Express Request type ────────────────────────────────────────────
//
// We already extended Request in express.d.ts, but we add `user` here
// specifically for authenticated routes — controllers can read req.user.

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

// ─── requireAuth middleware ───────────────────────────────────────────────────

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  // 1. Read the Authorization header
  //    Expected format: "Bearer eyJhbGciOiJIUzI1NiJ9..."
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided — reject immediately
    next(new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED))
    return
  }

  // 2. Extract the token (everything after "Bearer ")
  const token = authHeader.split(' ')[1]

  try {
    // 3. Verify the signature and decode the payload
    //    jwt.verify() throws if:
    //      - The signature is invalid (token was tampered with)
    //      - The token has expired (exp < now)
    //      - Any other malformation
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload

    // 4. Attach the decoded user to the request
    //    Controllers can now read req.user.userId, req.user.role
    req.user = payload

    next()
  } catch {
    // Covers: JsonWebTokenError, TokenExpiredError, NotBeforeError
    next(new AppError('Invalid or expired token', 401, ErrorCode.UNAUTHORIZED))
  }
}
