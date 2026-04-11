/**
 * config/index.ts — Barrel Export
 *
 * WHAT IS A BARREL EXPORT?
 *   Instead of importing from individual files like:
 *     import { env }    from '@config/env'
 *     import { db }     from '@config/database'
 *     import { logger } from '@config/logger'
 *
 *   A barrel lets you write:
 *     import { env, db, logger } from '@config'
 *
 *   This index.ts re-exports everything from all files in the folder.
 *   Clean, convenient, and consistent across the codebase.
 *
 * NOTE ON IMPORT ORDER:
 *   env.ts MUST be imported first because database.ts and logger.ts
 *   both import from env.ts. Node.js handles circular dependencies
 *   carefully, but importing env first avoids any timing issues.
 */

export { env } from './env'
export type { Env } from './env'

export { db } from './database'

export { logger, morganStream } from './logger'

export { corsOptions } from './cors'
