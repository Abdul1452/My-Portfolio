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
import { z } from 'zod'

 
const envSchema = z.object({
  // ── Server ─────────────────────────────────────────────────────────────────
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
 
  PORT: z.coerce.number().default(4000),
  // z.coerce.number() is important here!
  // process.env.PORT is always a string like "4000".
  // coerce converts "4000" → 4000 (a real number).
 
  API_VERSION: z.string().default('v1'),
  API_PREFIX: z.string().default('/api/v1'),

  // ── Database ────────────────────────────────────────────────────────────────
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required — add it to your .env file')
    .url('DATABASE_URL must be a valid PostgreSQL connection string'),
  // .url() checks it starts with postgresql:// or postgres://
 
  // ── Email (Nodemailer) ──────────────────────────────────────────────────────
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z
    .string()
    .transform(val => val === 'true')  // "true" string → boolean true
    .default('false'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  CONTACT_EMAIL_TO: z.string().optional(),
  CONTACT_EMAIL_FROM: z
    .string()
    .default('Abdulwasiu Portfolio <noreply@abdulwasiu.dev>'),
 
  // ── Security ────────────────────────────────────────────────────────────────
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters for security'),
  // We enforce a minimum length — a short secret is easy to guess.
 
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  // This is stored as a comma-separated string in .env:
  // CORS_ORIGINS=http://localhost:5173,https://abdulwasiu.dev
  // We'll split it into an array in config/cors.ts
 
  // ── Rate Limiting ───────────────────────────────────────────────────────────
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX: z.coerce.number().default(100),
})
 
// ─── 2. Parse process.env ───────────────────────────────────────────────────
//
// .safeParse() runs the validation WITHOUT throwing.
// It returns either:
//   { success: true,  data: { PORT: 4000, ... } }
//   { success: false, error: ZodError }
//
// We use safeParse (not parse) so we can show a nice error message.
 
const parsed = envSchema.safeParse(process.env)
 
// ─── 3. Handle validation failure ───────────────────────────────────────────
//
// If anything is wrong, print exactly which variables failed and exit.
// This is much better than crashing 10 files later with a confusing error.
 
if (!parsed.success) {
  console.error('  Invalid environment variables:\n')
 
  // ZodError has an array of "issues" — each one describes a problem.
  // formatted() turns them into a readable object like:
  //   { DATABASE_URL: { _errors: ['DATABASE_URL is required'] } }
  const formatted = parsed.error.format()
  console.error(JSON.stringify(formatted, null, 2))
 
  console.error('\n  Check your backend/.env file and add the missing variables.')
  process.exit(1) // Exit with error code 1 — stops the server from starting
}
 
// ─── 4. Export the validated, typed env object ──────────────────────────────
//
// Everything that imports `env` gets a fully-typed object.
// TypeScript knows env.PORT is a number, env.DATABASE_URL is a string, etc.
// No more "possibly undefined" warnings throughout the codebase.
 
export const env = parsed.data
 
// ─── 5. Export the TypeScript type (optional but useful) ────────────────────
//
// z.infer<typeof envSchema> extracts the TypeScript type from the Zod schema.
// This means the type and the validation are always in sync — you can't
// add a new env var without it appearing in both the schema and the type.
 
export type Env = z.infer<typeof envSchema>



