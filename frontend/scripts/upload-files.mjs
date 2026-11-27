/**
 * upload-files.mjs — Copy frontend/files/ into the R2 bucket
 *
 * frontend/files/ is the local mirror of the bucket: the path under files/
 * becomes the object's key, and the Worker serves it at /files/<key>.
 *
 *   files/docs/project-management-guidebook.pdf
 *     → R2 key  docs/project-management-guidebook.pdf
 *     → URL     https://olamilekan.dev/files/docs/project-management-guidebook.pdf
 *
 * USAGE (from frontend/, after `pnpm exec wrangler login` once):
 *   pnpm files:upload              upload to the real bucket on Cloudflare
 *   pnpm files:upload --local      fill wrangler's local bucket for `pnpm cf:preview`
 *   pnpm files:upload --dry-run    only list what would be uploaded
 *
 * Re-running is safe: an object with the same key is simply replaced.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, extname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

// Same name as r2_buckets in wrangler.jsonc.
const BUCKET = 'olamilekan-portfolio-files'
// Same rules as worker/index.ts: anything else would never be served.
const ALLOWED_FOLDERS = ['docs', 'certificates', 'images']
const KEY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*(?:\/[A-Za-z0-9][A-Za-z0-9._-]*)+$/

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const filesDir = join(root, 'files')
const types = JSON.parse(readFileSync(join(root, 'scripts', 'file-types.json'), 'utf8'))
// wrangler's package "exports" hide bin/, so point at the installed copy.
const wrangler = join(root, 'node_modules', 'wrangler', 'bin', 'wrangler.js')
if (!existsSync(wrangler)) {
  console.error('wrangler is not installed: run `pnpm install` first.')
  process.exit(1)
}

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const target = args.includes('--local') ? '--local' : '--remote'

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) yield* walk(path)
    else yield path
  }
}

const uploads = []
const skipped = []
for (const path of walk(filesDir)) {
  const key = relative(filesDir, path).split(sep).join('/')
  if (key === 'README.md') continue
  const type = types[extname(key).toLowerCase()]
  if (!KEY_PATTERN.test(key) || !ALLOWED_FOLDERS.includes(key.split('/')[0]) || !type) {
    skipped.push(key)
    continue
  }
  uploads.push({ key, path, type })
}

for (const key of skipped) {
  console.warn(`skip  ${key}  (needs a folder in ${ALLOWED_FOLDERS.join('/')}, letters/digits/.-_ only, and a known file type)`)
}
if (!uploads.length) {
  console.log('Nothing to upload.')
  process.exit(0)
}

let failed = 0
for (const { key, path, type } of uploads) {
  console.log(`${dryRun ? 'would upload' : 'upload'}  ${key}  (${type})`)
  if (dryRun) continue
  // Run wrangler with this Node directly: no shell, so paths with spaces
  // (like this OneDrive folder) need no quoting.
  const result = spawnSync(
    process.execPath,
    [wrangler, 'r2', 'object', 'put', `${BUCKET}/${key}`, '--file', relative(root, path), '--content-type', type, target],
    { cwd: root, stdio: 'inherit' },
  )
  if (result.status !== 0) failed++
}

if (failed) {
  console.error(`\n${failed} upload(s) failed.`)
  process.exit(1)
}
