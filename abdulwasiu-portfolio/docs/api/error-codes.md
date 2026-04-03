# API Error Codes

All errors follow this shape:
```json
{
  "error": "Short error message",
  "code": "ERROR_CODE",
  "issues": []  // only on validation errors
}
```

| HTTP | Code | Meaning |
|---|---|---|
| 400 | BAD_REQUEST | Malformed request |
| 404 | NOT_FOUND | Resource not found |
| 422 | VALIDATION_ERROR | Zod validation failed |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Unexpected server error |
