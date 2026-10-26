/**
 * contact.types.ts — Contact Form Types
 *
 * ContactInput = what comes IN (request body from the frontend form)
 * ContactDTO   = what we return OUT (confirmation to the frontend)
 */

// What the frontend sends in the POST /contact request body
export interface ContactInput {
  name: string
  email: string
  subject: string
  message: string
}

// What the backend returns after saving the contact submission
export interface ContactDTO {
  id: string
  name: string
  email: string
  subject: string
  createdAt: string // ISO date string
}