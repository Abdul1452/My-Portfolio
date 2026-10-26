/**
 * meta.data.ts — Site Metadata & Personal Info
 *
 * WHAT THIS FILE HOLDS:
 *   Your name, tagline, SEO description, and social links — all the
 *   "who am I" content used across the site (hero, nav, footer, contact)
 *   AND in the HTML <head> for SEO / social sharing (Open Graph tags).
 *
 * READING FROM ENV WITH A FALLBACK:
 *   Social URLs and contact email come from environment variables so you
 *   can change them without editing code (and keep them out of the repo).
 *   We use `?? 'fallback'` so the site still works if an env var is missing.
 *
 *   import.meta.env.VITE_LINKEDIN_URL ?? 'https://linkedin.com/in/abdulwasiu'
 *   → uses the env value if set, otherwise the hardcoded fallback.
 *
 * WHY CENTRALIZE THIS:
 *   Your name and links appear in ~5 places. Defining them ONCE here means
 *   updating your email is a one-line change, not a hunt across components.
 */

// Type defined inline — frontend-only metadata.
export interface SiteMeta {
  name: string
  firstName: string
  title: string          // Professional title
  tagline: string        // Short hero sub-headline
  description: string     // SEO meta description
  location: string
  email: string
  ogImage: string        // Path to social-share preview image
  socials: {
    linkedin: string
    github: string
    twitter: string
  }
}

export const siteMeta: SiteMeta = {
  name: 'Abdulwasiu Abdullahi Olamilekan',
  firstName: 'Abdulwasiu',
  title: 'Software Engineer & Project Management Student',
  tagline:
    'I build scalable applications and lead structured projects for Finnish and Nordic tech companies — end-to-end.',
  description:
    'Abdulwasiu Abdullahi Olamilekan — Software Engineer and Project Management student based in Turku, Finland. Full-stack development with React, TypeScript, and Node.js, plus Agile project delivery.',
  location: 'Turku, Finland',

  // Env-driven with sensible fallbacks
  email: import.meta.env.VITE_CONTACT_EMAIL ?? 'abdulwasiu@example.fi',
  ogImage: '/og-image.png',

  socials: {
    linkedin: import.meta.env.VITE_LINKEDIN_URL ?? 'https://linkedin.com/in/abdulwasiu',
    github: import.meta.env.VITE_GITHUB_URL ?? 'https://github.com/abdulwasiu',
    twitter: 'https://twitter.com/abdulwasiu',
  },
}

// The hero stat cards (small, presentational — lives with meta).
export interface HeroStat {
  value: string
  label: string
}

export const heroStats: HeroStat[] = [
  { value: '5+',  label: 'Years Exp.' },
  { value: '40+', label: 'Projects' },
  { value: '12',  label: 'Clients' },
  { value: '2',   label: 'Domains' },
]

// The tech pills shown in the hero.
export const heroTechStack: string[] = [
  'React',
  'TypeScript',
  'Node.js',
  'PostgreSQL',
  'Agile PM',
  'Figma',
  'AWS',
]

// The "quick facts" cards in the About section.
export interface AboutFact {
  key: string
  value: string
}

export const aboutFacts: AboutFact[] = [
  { key: 'Location',    value: 'Turku, Finland 🇫🇮' },
  { key: 'Languages',   value: 'English · Finnish (learning)' },
  { key: 'Education',   value: 'Project Management (ongoing)' },
  { key: 'Open To',     value: 'Full-time · Contract · Remote' },
  { key: 'Work Permit', value: 'Valid EU / Finnish Residence' },
  { key: 'LinkedIn',    value: 'linkedin.com/in/abdulwasiu' },
]
