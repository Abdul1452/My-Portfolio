/**
 * env.ts — Environment Variable Validation
 *
 * WHAT THIS FILE DOES:
 *   Reads every variable from process.env, validates them with Zod,
 *   and exports a single typed `env` object the rest of the app uses.
 *
 * WHY ZOD?
 *   process.env gives you `string | undefined` for everything.
 *   Zod lets us say "this must be a string", "this must be a number",
 *   "this has a default value of X", etc. — and it throws a clear error
 *   at startup if something is missing, not 10 files later.
 *
 * USAGE (in other files):
 *   import { env } from '@config/env'
 *   console.log(env.PORT)           // number, guaranteed
 *   console.log(env.DATABASE_URL)   // string, guaranteed
 */
