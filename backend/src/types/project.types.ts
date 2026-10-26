/**
 * project.types.ts — Project & PM Project Types
 *
 * DTO = Data Transfer Object.
 * A DTO is the shape of data as it LEAVES your API — what the frontend receives.
 * It might differ from the database model (you might hide internal fields,
 * combine fields, or rename them for the client).
 */

export interface ProjectDTO {
  id: string
  slug: string        // URL-friendly identifier: "devconnect-hub"
  title: string
  tag: string         // e.g. "Full-Stack · React · Node.js"
  description: string
  year: string        // e.g. "2024" or "2023–now"
  category: 'engineering' | 'pm'
  linkLabel: string   // e.g. "Case Study", "GitHub", "View Live"
  linkUrl: string | null
  imageUrl: string | null
  featured: boolean
  order: number       // For manual sorting
}

export interface PMProjectDTO {
  id: string
  slug: string
  title: string
  tag: string
  description: string
  icon: string        // Emoji or icon name: "📖", "📊"
  year: string
  linkLabel: string
  linkUrl: string | null
  order: number
}

// Query filters — what the client can pass as URL params
// GET /projects?featured=true&category=engineering
export interface ProjectQueryParams {
  featured?: boolean
  category?: 'engineering' | 'pm'
}