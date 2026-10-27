/**
 * meta.data.ts — Site Metadata & Personal Info
 *
 * WHAT THIS FILE HOLDS:
 *   Your name, tagline, SEO description, and social links — the "who am I"
 *   content used by the shared layout (Navbar, MobileMenu, Footer) on the
 *   secondary pages (/pm, /projects/:slug).
 *
 * ONE SOURCE OF TRUTH:
 *   The real values live in portfolio.data.ts (the homepage's content file).
 *   This file re-shapes them for the older layout components, so a new email
 *   or LinkedIn URL is changed in exactly one place.
 *
 *   (These used to come from VITE_* environment variables with placeholder
 *   fallbacks. Your email and profile links aren't secrets — they're printed
 *   on the page — so reading them from code is simpler and can't drift.)
 */

import { profile } from './portfolio.data'

// Type defined inline — frontend-only metadata.
export interface SiteMeta {
  name: string
  firstName: string
  title: string          // Professional title
  tagline: string        // Short sub-headline
  description: string    // SEO meta description
  location: string
  email: string
  ogImage: string        // Path to social-share preview image
  socials: {
    linkedin: string
    github: string
  }
}

export const siteMeta: SiteMeta = {
  name: profile.name,
  firstName: 'Abdullahi',
  title: 'Software Engineering & Project Management student',
  tagline:
    'Backend and full-stack development with Node.js, TypeScript, PostgreSQL and Docker, plus the project management to deliver it.',
  description:
    'Software Engineering & Project Management student in Turku, Finland. Backend and full-stack development with Node.js, TypeScript, PostgreSQL and Docker. PRY Foundation (IPMA) certified.',
  location: profile.location,
  email: profile.email,
  ogImage: '/og-image.png',
  socials: {
    linkedin: profile.links.linkedin,
    github: profile.links.github,
  },
}
