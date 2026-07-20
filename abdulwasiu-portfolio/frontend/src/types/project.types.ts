/**
 * project.types.ts — Project & PM Project Types (Frontend)
 *
 * THESE MIRROR THE BACKEND DTOs.
 *   The backend returns JSON shaped like ProjectDTO (see backend/src/types).
 *   The frontend must describe that SAME shape so TypeScript can verify
 *   we read the data correctly.
 *
 * WHY DUPLICATE THEM INSTEAD OF SHARING?
 *   In larger projects you'd put shared types in a separate package that
 *   both frontend and backend import. For a learning project, duplicating
 *   is simpler and keeps the two sides decoupled. Just remember: if you
 *   change a backend DTO, update the matching frontend type here too.
 *
 * NOTE ON null vs undefined:
 *   The backend sends `linkUrl: null` when there's no link (JSON has null,
 *   not undefined). So we type it as `string | null` to match exactly.
 */

// Matches backend ProjectDTO
export interface Project {
  id: string
  slug: string
  title: string
  tag: string          // "Full-Stack · React · Node.js"
  description: string
  year: string         // "2024" or "2023–now"
  category: 'engineering' | 'pm'
  linkLabel: string    // "Case Study", "GitHub", "View Live"
  linkUrl: string | null
  imageUrl: string | null
  featured: boolean
  order: number
}

// Matches backend PMProjectDTO
export interface PMProject {
  id: string
  slug: string
  title: string
  tag: string
  description: string
  icon: string         // Emoji: "📖", "📊", "🗺️"
  year: string
  linkLabel: string
  linkUrl: string | null
  order: number
}

// A "union type" — a value that is one of several literal strings.
// Used by the ProjectsSection filter tabs.
export type ProjectFilter = 'all' | 'featured' | 'engineering' | 'pm'
