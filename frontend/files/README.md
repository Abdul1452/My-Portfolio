# files/ — local mirror of the R2 bucket

Certificates, the guidebook PDF and images live in Cloudflare R2 (bucket
`olamilekan-portfolio-files`), not in git. This folder is the local copy:
everything in it except this README is git-ignored.

| Put it in      | It's served at                       |
|----------------|--------------------------------------|
| `docs/`        | `/files/docs/<name>`                 |
| `certificates/`| `/files/certificates/<name>`         |
| `images/`      | `/files/images/<name>`               |

File names: letters, digits, `.`, `-`, `_` (no spaces). Types: PDF, PNG,
JPEG, WebP, AVIF, GIF, SVG.

- `pnpm dev` serves this folder at `/files/...` directly.
- `pnpm files:upload` copies it to the bucket (run `pnpm exec wrangler login` once first).
- Link to a file from `src/data/portfolio.data.ts` with its `/files/...` path.
