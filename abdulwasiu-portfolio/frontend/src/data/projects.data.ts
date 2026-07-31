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
    id: 'cuid_project_petosvahti',
    slug: 'petosvahti',
    title: 'Petosvahti',
    tag: 'Python · FastAPI · Kafka · scikit-learn · Docker',
    description:
      'Real-time fraud detection for Finnish payments. Kafka streams transactions, an Isolation Forest scores them, FastAPI returns approve / review / block with reason codes. Written against PSD3 and SEPA Instant, with charter, risk register, ADRs and an EU compliance folder.',
    year: '2026',
    category: 'engineering',
    linkLabel: 'Repository',
    linkUrl: 'https://github.com/Abdul1452/Petosvahti-',
    imageUrl: null,
    featured: true,
    order: 1,
  },
  {
    id: 'cuid_project_slope_deflection',
    slug: 'slope-deflection-calculator',
    title: 'Slope Deflection Calculator',
    tag: 'Next.js 14 · TypeScript · Recharts',
    description:
      'Beam and rigid-frame analysis in the browser: fixed-end moments, joint equilibrium with sway, bending-moment and shear-force diagrams, support reactions.',
    year: '2025',
    category: 'engineering',
    linkLabel: 'Case study',
    linkUrl: 'https://github.com/Abdul1452/Slope-deflection-Calculator',
    imageUrl: null,
    featured: false,
    order: 2,
  },
  {
    id: 'cuid_project_serverless_quote',
    slug: 'serverless-quote-api',
    title: 'Serverless Quote API',
    tag: 'AWS SAM · Lambda · Python',
    description:
      'REST API plus a daily EventBridge job on AWS Lambda, deployed with SAM. Structured CloudWatch logging, pytest suite, GitHub Actions CI on every push.',
    year: '2025',
    category: 'engineering',
    linkLabel: 'Case study',
    linkUrl: 'https://github.com/Abdul1452/inspirational-quote-generator',
    imageUrl: null,
    featured: false,
    order: 3,
  },
]
