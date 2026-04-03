# API Endpoint Reference

**Base URL:** `http://localhost:4000/api/v1`

---

## Health

### GET /health
Returns server status.

**Response 200:**
```json
{
  "status": "ok",
  "timestamp": "2025-04-03T12:00:00.000Z",
  "uptime": 1234.56
}
```

---

## Projects

### GET /projects
Returns list of all engineering projects.

**Query params:**
- `featured=true` — filter featured only
- `category=engineering|pm`

**Response 200:**
```json
{
  "data": [
    {
      "id": "clxyz...",
      "slug": "devconnect-hub",
      "title": "DevConnect Hub",
      "tag": "Full-Stack · React · Node.js",
      "description": "...",
      "year": "2024",
      "linkLabel": "Case Study",
      "linkUrl": "https://..."
    }
  ]
}
```

### GET /projects/:slug
Returns a single project by slug.

---

## Skills

### GET /skills
Returns all skill categories with their skills.

**Response 200:**
```json
{
  "data": [
    {
      "id": "...",
      "name": "Frontend",
      "skills": [
        { "name": "React / Next.js", "percentage": 92 }
      ]
    }
  ]
}
```

---

## PM Projects

### GET /pm-projects
Returns all PM deliverables.

---

## Contact

### POST /contact
Submits a contact form message.

**Request body:**
```json
{
  "name": "string (required, 2–100 chars)",
  "email": "string (required, valid email)",
  "subject": "string (required, 5–200 chars)",
  "message": "string (required, 20–2000 chars)"
}
```

**Response 201:**
```json
{
  "message": "Message sent successfully. I'll be in touch soon!"
}
```

**Response 422 (validation error):**
```json
{
  "error": "Validation failed",
  "issues": [{ "field": "email", "message": "Invalid email address" }]
}
```

---

## Error Codes

See [error-codes.md](./error-codes.md).
