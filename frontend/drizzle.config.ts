/**
 * drizzle.config.ts — Where drizzle-kit finds the schema and writes migrations
 *
 * Only used to GENERATE SQL (`pnpm db:generate`). Applying it is wrangler's
 * job (`pnpm db:migrate:local` / `db:migrate:remote`), which reads the same
 * folder through migrations_dir in wrangler.jsonc.
 */
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './worker/api/db/schema.ts',
  out: './worker/api/db/migrations',
})
