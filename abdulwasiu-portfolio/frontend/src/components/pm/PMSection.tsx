/**
 * PMSection.tsx — Project Management Showcase
 *
 * THE ASSEMBLER:
 *   This section composes all the PM pieces into one cohesive block:
 *     1. Intro header (your PM positioning)
 *     2. PMCard grid — the PM deliverables (from useApp: API or fallback)
 *     3. GuidebookCard — featured, with a table of contents
 *     4. GanttPreview — the CSS Gantt chart
 *     5. SprintCard row — an illustrative sprint board
 *
 *   Same assembly pattern as the Phase 8 sections. It adds the id="pm-projects"
 *   that the navbar already links to.
 *
 * DATA MIX:
 *   - pmProjects come from useApp() (real data path).
 *   - The guidebook chapters and sprints are illustrative UI data defined
 *     here as constants — they're presentational, not from the database.
 */

import { Section } from '@layout'
import { SectionLabel, PMCard, Badge, ScrollReveal } from '@ui'
import { useApp } from '@hooks/useApp'
import { GuidebookCard } from './GuidebookCard'
import { GanttPreview } from './GanttPreview'
import { SprintCard, type Sprint } from './SprintCard'
import styles from './PMSection.module.css'

// Illustrative guidebook chapters (presentational data).
const guidebookChapters = [
  'Agile & Scrum Foundations',
  'Waterfall & Hybrid Models',
  'Risk Registers & Mitigation',
  'Stakeholder Mapping',
  'Finnish Working Culture',
  'Estimation & Roadmapping',
]

// Illustrative sprint board (presentational data).
const sprints: Sprint[] = [
  { id: 's1', number: 1, goal: 'Project setup, scaffolding & CI/CD pipeline', startDate: 'Wk 1', endDate: 'Wk 2', status: 'completed', storyPoints: 21 },
  { id: 's2', number: 2, goal: 'Backend API & database layer', startDate: 'Wk 3', endDate: 'Wk 4', status: 'completed', storyPoints: 34 },
  { id: 's3', number: 3, goal: 'Frontend components & sections', startDate: 'Wk 5', endDate: 'Wk 6', status: 'active', storyPoints: 29 },
  { id: 's4', number: 4, goal: 'Testing, polish & deployment', startDate: 'Wk 7', endDate: 'Wk 8', status: 'planned', storyPoints: 18 },
]

export function PMSection() {
  const { pmProjects } = useApp()

  return (
    <Section id="pm-projects" background="light">
      {/* Intro header */}
      <ScrollReveal>
        <div className={styles.header}>
          <Badge className={styles.badge}>Project Management</Badge>
          <SectionLabel number="05" label="PM Work & Deliverables" />
        </div>
        <h2 className={styles.title}>
          Engineering meets structured delivery.
        </h2>
        <p className={styles.intro}>
          Beyond writing code, I plan and lead projects end-to-end. Here are the
          PM artifacts I&apos;ve built — a practical guidebook, a scheduling tool,
          and the delivery framework behind this very portfolio.
        </p>
      </ScrollReveal>

      {/* PM project cards (from data) */}
      <div className={styles.cards}>
        {pmProjects.map(pm => (
          <ScrollReveal key={pm.id}>
            <PMCard pmProject={pm} />
          </ScrollReveal>
        ))}
      </div>

      {/* Featured: PM Guidebook */}
      <ScrollReveal className={styles.featured}>
        <GuidebookCard
          title="The PM Guidebook"
          description="My comprehensive reference for running software projects — from Agile ceremonies to risk management, written for the Finnish tech context."
          chapters={guidebookChapters}
          linkLabel="Read the Guidebook"
          linkUrl={null}
        />
      </ScrollReveal>

      {/* Gantt chart */}
      <ScrollReveal className={styles.ganttWrap}>
        <h3 className={styles.subheading}>Sample Delivery Timeline</h3>
        <p className={styles.subtext}>
          An 8-week software delivery plan — the kind of schedule I build for
          real projects, showing phases, overlap, and dependencies.
        </p>
        <GanttPreview />
      </ScrollReveal>

      {/* Sprint board */}
      <ScrollReveal className={styles.sprintsWrap}>
        <h3 className={styles.subheading}>Sprint Board</h3>
        <div className={styles.sprints}>
          {sprints.map(sprint => (
            <SprintCard key={sprint.id} sprint={sprint} />
          ))}
        </div>
      </ScrollReveal>
    </Section>
  )
}
