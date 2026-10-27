# API Versioning

The API is versioned in the URL path:

```text
http://localhost:4000/api/v1/projects
                      └┬─┘└┬┘└──┬───┘
                       │   │    └─ resource
                       │   └────── version
                       └────────── base path
```

The current (and only) version is **v1**.

## How to find out which versions exist

```http
GET /api
```

```json
{
  "data": {
    "latest": "v1",
    "versions": [{ "version": "v1", "path": "/api/v1" }]
  }
}
```

## Response headers

Every response from a versioned route carries:

| Header | When | Example |
|---|---|---|
| `API-Version` | Always | `v1` |
| `Deprecation` | Version is deprecated ([RFC 9745](https://www.rfc-editor.org/rfc/rfc9745)) | `@1798761600` (Unix seconds) |
| `Sunset` | Removal date is set ([RFC 8594](https://www.rfc-editor.org/rfc/rfc8594)) | `Thu, 01 Jul 2027 00:00:00 GMT` |
| `Link` | Migration guide exists | `<https://…>; rel="deprecation"` |

All four are listed in CORS `exposedHeaders`, so frontend code can read
them with `response.headers.get('API-Version')`.

## Unsupported versions

A request whose first path segment isn't a supported version gets a 404
with a dedicated error code, so the client knows the problem is the version,
not the resource:

```http
GET /api/v9/projects
GET /api/projects        ← version forgotten
```

```json
{
  "error": "API version 'v9' is not supported. Supported versions: v1",
  "code": "UNSUPPORTED_API_VERSION"
}
```

A supported version with an unknown route (`/api/v1/nope`) is a normal
`404 NOT_FOUND`.

## When to create a new version

A new version is needed **only for breaking changes**: changes that could
make an existing, correctly written client stop working.

| Change | Breaking? | Where it goes |
|---|---|---|
| Add a new endpoint | No | v1 |
| Add a new **optional** request field | No | v1 |
| Add a new field to a response | No | v1 |
| Remove or rename a response field | **Yes** | v2 |
| Change a field's type (`"2024"` → `2024`) | **Yes** | v2 |
| Make an optional request field required | **Yes** | v2 |
| Change what a URL returns or does | **Yes** | v2 |
| Remove an endpoint | **Yes** | v2 |

## Adding v2 (checklist)

1. **Register it:** add `'v2'` to `API_VERSIONS` in
   `backend/src/config/api.ts`, and set `LATEST_API_VERSION = 'v2'`.
2. **Write the routes:** create `backend/src/routes/v2/index.ts`. Only
   routes that change need new handlers; unchanged resources can mount the
   same v1 sub-router:
   ```ts
   import projectRoutesV2 from './project.routes'      // new behaviour
   import skillRoutes     from '../v1/skill.routes'    // unchanged, re-used
   ```
3. **Mount it:** in `backend/src/routes/index.ts`:
   ```ts
   router.use('/v2', apiVersion('v2'), v2Router)
   ```
4. **Deprecate v1:** give v1 dates so clients get warned automatically:
   ```ts
   router.use('/v1', apiVersion('v1', {
     deprecatedAt: new Date('2027-01-01'),
     sunsetAt:     new Date('2027-07-01'),
     docsUrl:      'https://abdulwasiu.dev/docs/api/v1-to-v2',
   }), v1Router)
   ```
5. **Move the frontend:** update `VITE_API_BASE_URL` to `/api/v2`.
6. **After the sunset date:** remove `'v1'` from `API_VERSIONS`, delete its
   `router.use('/v1', …)` line and any v1-only route files. Requests to
   `/api/v1/...` then return `UNSUPPORTED_API_VERSION`.

## Why the version isn't in `.env`

Earlier versions read `API_VERSION` / `API_PREFIX` from `.env`. That was
removed: which URLs exist is decided by the route code, not by the machine
the server runs on, and a typo in one environment's `.env` could silently
serve the API at the wrong path. Old `API_VERSION` / `API_PREFIX` lines in a
`.env` file are now ignored.
