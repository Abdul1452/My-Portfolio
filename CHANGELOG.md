# Changelog

All notable changes to this project will be documented in this file.

Format: [Semantic Versioning](https://semver.org/)

## [Unreleased]

### Added
- Homepage redesign (v7, storytelling), styles in `portfolio-v7.css`:
  - Story headline ("I started out tracking cargo in Lagos. Now I build the
    systems that keep things moving.") with a journey route, 2021 → 2027.
  - Three.js story globe in the hero: an arc from Lagos to Turku.
  - Certificate deck: every certificate as a picture in a stacked pile you
    swipe/drag through (or ← →, dots, "Up next"), with a full-size view,
    Verify and Original links, and an All / Certifications / Hackathons
    filter. PDF previews come from
    `frontend/scripts/render-certificate-previews.py`; OPSWAT and
    Codecademy previews are captures of their public certificate pages.
  - LinkedIn section: a flip-able 3D business card with "Save contact"
    (.vcf), and a feed for posts that feature me (`linkedin.posts`, with
    click-to-load LinkedIn embeds).
  - "On my desk": the books I'm reading as a 3D book you can turn
    (Three.js) with the real front cover, starting with Designing
    Data-Intensive Applications.
  - CSP allows LinkedIn embed frames. Fonts stay Onest + JetBrains Mono.
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
