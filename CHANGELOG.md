# Changelog

All notable changes to this project will be documented in this file.

Format: [Semantic Versioning](https://semver.org/)

## [Unreleased]

### Added
- API versioning: routes now live in `backend/src/routes/v1/`, mounted by a
  version registry in `routes/index.ts`. New `GET /api` lists supported
  versions; every versioned response carries an `API-Version` header, with
  optional `Deprecation` / `Sunset` / `Link` headers for retiring a version.
  Unknown versions return `404 UNSUPPORTED_API_VERSION`.
  See `docs/api/versioning.md`.

### Changed
- API version and base path moved from `.env` (`API_VERSION`, `API_PREFIX`)
  into `backend/src/config/api.ts`. Existing URLs (`/api/v1/...`) are
  unchanged.
- Database schema is now defined only in `backend/prisma/schema.prisma`.
  Replaced the hand-written init migration (and its follow-up fix) with a
  single Prisma-generated `0_init` baseline; Prisma now manages the `citext`
  extension via `postgresqlExtensions`.

### Removed
- Raw SQL schema files `database/migrations/*.sql` and
  `database/schemas/schema.sql` (unused duplicates that had drifted from the
  Prisma schema).

### Added
- Initial project scaffold
- Figma design (desktop + mobile + component library)
- Frontend: React + TypeScript + Vite + Tailwind setup
- Backend: Express + TypeScript + Prisma setup
- PostgreSQL database schema
- GitHub Actions CI/CD workflows
- Full documentation structure

## [0.1.0] — 2025-04-03
- Project initialized
