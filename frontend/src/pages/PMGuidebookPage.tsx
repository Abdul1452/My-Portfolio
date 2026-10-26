/**
 * PMGuidebookPage.tsx — Dedicated PM Deep-Dive (/pm)
 *
 * A SECONDARY PAGE:
 *   While the home page shows a PM *summary* (PMSection), this dedicated page
 *   gives the full treatment — reusing the same PM building blocks (Guidebook,
 *   Gantt, Sprints) with room to breathe. Linked from the nav or PM cards.
 *
 * REUSE OVER REBUILD:
 *   We import the same GuidebookCard, GanttPreview, and SprintCard components
 *   from @pm. Building them as standalone pieces in Phase 9 pays off now —
 *   we assemble a whole new page from existing parts, no duplication.
 */

import { useNavigate } from 'react-router-dom'
import { Section } from '@layout'
import { SectionLabel, Button, ScrollReveal } from '@ui'
import { GuidebookCard, GanttPreview, SprintCard, type Sprint } from '@pm'

const chapters = [
  'Agile & Scrum Foundations',
  'Waterfall & Hybrid Models',
  'Risk Registers & Mitigation',
  'Stakeholder Mapping & Communication',
  'Finnish Working Culture & Practices',
  'Estimation, Velocity & Roadmapping',
  'Retrospectives & Continuous Improvement',
  'Tools: Jira, Notion, Linear',
]

const sprints: Sprint[] = [
  { id: 's1', number: 1, goal: 'Discovery, requirements & project charter', startDate: 'Wk 1', endDate: 'Wk 2', status: 'completed', storyPoints: 18 },
  { id: 's2', number: 2, goal: 'Architecture, design system & scaffolding', startDate: 'Wk 3', endDate: 'Wk 4', status: 'completed', storyPoints: 26 },
  { id: 's3', number: 3, goal: 'Core feature build & integration', startDate: 'Wk 5', endDate: 'Wk 6', status: 'active', storyPoints: 31 },
  { id: 's4', number: 4, goal: 'Hardening, QA & launch', startDate: 'Wk 7', endDate: 'Wk 8', status: 'planned', storyPoints: 20 },
]

export function PMGuidebookPage() {
  const navigate = useNavigate()

  return (
    <Section id="pm-guidebook" background="light">
      <ScrollReveal>
        <SectionLabel number="PM" label="Project Management Deep-Dive" />
        <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 700, margin: '1rem 0 0.5rem' }}>
          How I Run Projects
        </h1>
        <p
          style={{
            fontSize: 'var(--text-body-lg)',
            color: 'var(--color-muted)',
            lineHeight: 1.7,
            maxWidth: '640px',
            marginBottom: '3rem',
          }}
        >
          A closer look at my project management approach, tools, and the
          artifacts I create to keep software delivery on track.
        </p>
      </ScrollReveal>

      <ScrollReveal style={{ marginBottom: '4rem' }}>
        <GuidebookCard
          title="The PM Guidebook"
          description="My complete reference for running software projects end-to-end — the methodologies, ceremonies, and templates I rely on."
          chapters={chapters}
          linkLabel="Download PDF"
          linkUrl={null}
        />
      </ScrollReveal>

      <ScrollReveal style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 700, marginBottom: '1.5rem' }}>
          Delivery Timeline
        </h2>
        <GanttPreview />
      </ScrollReveal>

      <ScrollReveal style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 700, marginBottom: '1.5rem' }}>
          Sprint Board
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {sprints.map(s => (
            <SprintCard key={s.id} sprint={s} />
          ))}
        </div>
      </ScrollReveal>

      <Button variant="primary" onClick={() => navigate('/')}>
        ← Back to home
      </Button>
    </Section>
  )
}
