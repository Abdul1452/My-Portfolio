/**
 * contact.types.ts — Contact Form Types (Frontend)
 *
 * TWO distinct types for the contact form:
 *
 *   ContactFormData   — the VALUES the user types (what we send to the API)
 *   ContactFormErrors — the ERROR MESSAGES per field (what we show in red)
 *
 * WHY A SEPARATE ERRORS TYPE?
 *   Each field can have its own validation error. Using a matching shape
 *   (same keys, but string error messages) makes it easy to render errors
 *   next to the right input:
 *     errors.email && <span>{errors.email}</span>
 *
 * Partial<T> makes every field optional — because usually only SOME fields
 * have errors at a time (or none).
 */

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// Same keys as ContactFormData, but each is an optional error message.
// Partial<> means: every key is optional (may be present or absent).
export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>
// Record<keyof ContactFormData, string> = { name: string; email: string; ... }
// Partial<...> wraps it so each becomes optional: { name?: string; ... }

// The status of the form submission — used to show loading/success/error UI.
export type ContactFormStatus = 'idle' | 'loading' | 'success' | 'error'
