/**
 * database.ts — Prisma Client Singleton
 *
 * WHAT THIS FILE DOES:
 *   Creates ONE Prisma client and reuses it across the entire app.
 *
 * WHY A SINGLETON?
 *   Prisma opens a "connection pool" to the database — a set of
 *   persistent connections so we don't reconnect from scratch every request.
 *
 *   If you wrote `new PrismaClient()` in every file that needs the DB,
 *   you'd create dozens of connection pools and quickly run out of
 *   database connections. One client, shared everywhere = correct pattern.
 *
 * THE DEVELOPMENT TRICK:
 *   In development, Next.js / Vite hot-reload re-runs this module on
 *   every file save. Without the globalThis trick below, every hot-reload
 *   creates a new PrismaClient — same problem as above.
 *
 *   We store the client on `globalThis` (the Node.js global object) so
 *   hot-reloads reuse the same instance. In production this never runs
 *   because there's no hot-reload.
 *
 * USAGE (in model files):
 *   import { db } from '@config/database'
 *   const projects = await db.project.findMany()
 */

import { PrismaClient } from '@prisma/client'
import { env } from './env'

// ─── Global type augmentation ────────────────────────────────────────────────
//
// TypeScript doesn't know about our custom property on globalThis,
// so we tell it here. This is a "declaration merging" — we're adding
// a property to an existing global type.

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined
}

// ─── Create or reuse the Prisma client ───────────────────────────────────────
//
// Logic:
//   1. In production (NODE_ENV === 'production'): always create a new client.
//      No hot-reload happens, so no need for the global trick.
//   2. In development: check if globalThis.__prismaClient already exists.
//      If yes → reuse it.
//      If no  → create a new one and store it on globalThis.

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    // `log` controls what Prisma prints to the console.
    // In development we want to see every SQL query it runs — helpful for
    // learning and debugging. In production we only log warnings and errors.
    log:
      env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error'],
  })
}

export const db: PrismaClient =
  env.NODE_ENV === 'production'
    ? createPrismaClient()
    : (globalThis.__prismaClient ??= createPrismaClient())
//                                  ^^^ This is the "nullish assignment" operator ??=
//   It means: "assign the right side ONLY if the left side is null or undefined"
//   So: if globalThis.__prismaClient is already set, keep it. Otherwise create a new one.