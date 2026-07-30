/**
 * projects.data.ts — Static Fallback Data for Engineering Projects
 *
 * WHAT THIS FILE IS:
 *   A hardcoded copy of the engineering projects, matching the SAME shape
 *   the API returns (the Project type). AppContext uses this when the
 *   backend is unreachable, so the portfolio always renders.
 *
 * WHY THE TYPE ANNOTATION (: Project[]) MATTERS:
 *   By declaring `export const projects: Project[]`, TypeScript checks
 *   every object below against the Project interface. If you forget a
 *   field (like `featured`) or misspell one, you get a compile error
 *   immediately — instead of a broken page at runtime.
 *
 * KEEP IN SYNC:
 *   This mirrors database/seeds/projects.seed.ts.
 *   When you add a real project, update BOTH (or eventually fetch only
 *   from the API and treat this purely as an offline safety net).
 */

import type { Project } from '@app-types'

// The `: Project[]` annotation makes TypeScript enforce the shape.
export const projects: Project[] = [
  {
    id: 'cuid_project_001',
    slug: 'devconnect-hub',
    title: 'DevConnect Hub',
    tag: 'Full-Stack · React · Node.js',
    description:
      'Developer collaboration platform with real-time chat, project boards and GitHub integration. GDPR-compliant architecture deployed on AWS with 99.8% uptime SLA.',
    year: '2024',
    category: 'engineering',
    linkLabel: 'Case Study',
    linkUrl: null,
    imageUrl: null,
    featured: true,
    order: 1,
  },
  {
    id: 'cuid_project_002',
    slug: 'nordic-shop-platform',
    title: 'Nordic Shop Platform',
    tag: 'E-Commerce · Next.js · AWS',
    description:
      'Nordic e-commerce platform with a custom ML recommendation engine, multi-currency support, and real-time inventory management. Built for the Finnish market.',
    year: '2023',
    category: 'engineering',
    linkLabel: 'Case Study',
    linkUrl: null,
    imageUrl: null,
    featured: true,
    order: 2,
  },
  {
    id: 'cuid_project_003',
    slug: 'suomi-ui',
    title: 'suomi-ui Library',
    tag: 'Open Source · TypeScript',
    description:
      'Open-source Finnish design system component library implementing accessibility-first patterns. 1.2k GitHub stars, used across 30+ Finnish startups.',
    year: '2022',
    category: 'engineering',
    linkLabel: 'GitHub',
    linkUrl: 'https://github.com/abdulwasiu/suomi-ui',
    imageUrl: null,
    featured: false,
    order: 3,
  },
  {
    id: 'cuid_project_004',
    slug: 'portfolio-website',
    title: 'This Portfolio',
    tag: 'Full-Stack · React · TypeScript · Node.js',
    description:
      'This very website — a full-stack monorepo portfolio built with React, TypeScript, Express, and PostgreSQL. Features a contact form, responsive design, and PM project showcase.',
    year: '2025',
    category: 'engineering',
    linkLabel: 'GitHub',
    linkUrl: 'https://github.com/abdulwasiu/portfolio',
    imageUrl: null,
    featured: false,
    order: 4,
  },
]
