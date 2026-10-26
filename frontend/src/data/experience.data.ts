/**
 * experience.data.ts — Work Experience Timeline
 *
 * FRONTEND-ONLY DATA:
 *   Unlike projects/skills, experience has no API endpoint or database table.
 *   It's purely presentational content that rarely changes, so it lives
 *   directly in the frontend. Because there's no backend DTO to mirror,
 *   we define its type right here in this file.
 *
 * WHERE IT'S USED:
 *   The AboutSection renders this as a vertical timeline of roles.
 */

// Define the type inline — this data is frontend-only.
export interface ExperienceItem {
  id: string
  company: string
  role: string
  location: string
  startDate: string    // "2023" or "Jan 2023"
  endDate: string      // "Present" or "Dec 2023"
  bullets: string[]    // Key achievements/responsibilities
  tags: string[]       // Tech or skills used, shown as pills
}

export const experience: ExperienceItem[] = [
  {
    id: 'exp_001',
    company: 'Futurice',
    role: 'Software Engineer',
    location: 'Helsinki, Finland',
    startDate: '2023',
    endDate: 'Present',
    bullets: [
      'Built and shipped full-stack features for Nordic enterprise clients using React and Node.js.',
      'Led sprint planning and coordinated cross-functional teams as an acting project lead.',
      'Improved application performance by 40% through code-splitting and query optimization.',
    ],
    tags: ['React', 'TypeScript', 'Node.js', 'Agile'],
  },
  {
    id: 'exp_002',
    company: 'Reaktor',
    role: 'Junior Developer',
    location: 'Turku, Finland',
    startDate: '2021',
    endDate: '2023',
    bullets: [
      'Developed accessibility-compliant (WCAG 2.1) UI components for public-sector clients.',
      'Collaborated in a Scrum team delivering GDPR-compliant data platforms.',
      'Contributed to the open-source suomi-ui design system.',
    ],
    tags: ['React', 'Accessibility', 'GDPR', 'Scrum'],
  },
  {
    id: 'exp_003',
    company: 'University of Turku',
    role: 'Project Management Student',
    location: 'Turku, Finland',
    startDate: '2024',
    endDate: 'Present',
    bullets: [
      'Studying project management methodologies: Agile, Waterfall, PRINCE2 fundamentals.',
      'Applying PM theory to real software projects — risk registers, Gantt charts, stakeholder maps.',
      'Building a PM Guidebook and interactive Gantt tool as capstone deliverables.',
    ],
    tags: ['Agile', 'Risk Management', 'Roadmapping'],
  },
]
