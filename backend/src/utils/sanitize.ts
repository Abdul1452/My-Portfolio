/**
 * sanitize.ts — Input Sanitization Helpers
 *
 * WHY SANITIZE USER INPUT?
 *   Users can send anything in a form field — including HTML tags like:
 *     <script>alert('hacked')</script>
 *   If you store this in the DB and later display it in HTML without escaping,
 *   it executes in other users' browsers (XSS attack).
 *
 *   Sanitization removes or escapes dangerous content before you process it.
 *   Validation (Zod) checks the shape. Sanitization cleans the content.
 *   You need BOTH.
 */

// Strip all HTML tags from a string.
// "Hello <script>bad()</script> world" → "Hello  world"
export function stripHtml(str: string): string {
  let sanitized = ''
  let insideTag = false

  for (const char of str) {
    if (char === '<') {
      insideTag = true
      continue
    }

    if (char === '>') {
      insideTag = false
      continue
    }

    if (!insideTag) {
      sanitized += char
    }
  }

  return sanitized
}

// Trim whitespace and strip HTML from a string
export function sanitizeString(str: string): string {
  return stripHtml(str.trim())
}

interface ContactLikeInput {
  name: string
  email: string
  subject: string
  message: string
}

export function sanitizeContactInput<T extends ContactLikeInput>(input: T): T {
  return {
    ...input,
    name: sanitizeString(input.name),
    email: sanitizeString(input.email),
    subject: sanitizeString(input.subject),
    message: sanitizeString(input.message),
  }
}
