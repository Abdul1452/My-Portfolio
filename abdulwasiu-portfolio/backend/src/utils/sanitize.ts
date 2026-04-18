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
  return str.replace(/<[^>]*>/g, '')
  // Regex: < followed by anything that isn't > followed by >
  // Replace all matches with empty string
}

// Trim whitespace and strip HTML from a string
export function sanitizeString(str: string): string {
  return stripHtml(str.trim())
}

// Sanitize all string fields in an object
export function sanitizeContactInput<T extends Record<string, string>>(input: T): T {
  const sanitized = { ...input }
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]) as T[typeof key]
    }
  }
  return sanitized
}
