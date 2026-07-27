/**
 * SprintCard.tsx — Sprint Timeline Card
 *
 * STATUS-DRIVEN STYLING:
 *   Each sprint has a status ('completed' | 'active' | 'planned'). The status
 *   badge's color is driven by that value using a data-status attribute +
 *   CSS attribute selectors — the same clean pattern as the Gantt phases.
 *
 * REUSABLE PROP SHAPE:
 *   This component takes a `sprint` prop (typed below). The parent PMSection
 *   passes an array of these to render a sprint board.
 */

import { cn } from '@utils/cn'
import styles from './SprintCard.module.css'

// The shape of one sprint. Defined here since it's PM-UI-specific.
export interface Sprint {
  id: string
  number: number
  goal: string
  startDate: string
  endDate: string
  status: 'completed' | 'active' | 'planned'
  storyPoints: number
}

interface SprintCardProps {
  sprint: Sprint
}

// Map each status to its human-readable label.
const STATUS_LABEL: Record<Sprint['status'], string> = {
  completed: 'Completed',
  active: 'In Progress',
  planned: 'Planned',
}

export function SprintCard({ sprint }: SprintCardProps) {
  return (
    <div className={cn(styles.card, styles[sprint.status])}>
      <div className={styles.header}>
        <span className={styles.sprintNum}>Sprint {sprint.number}</span>
        <span className={styles.badge} data-status={sprint.status}>
          {STATUS_LABEL[sprint.status]}
        </span>
      </div>

      <p className={styles.goal}>{sprint.goal}</p>

      <div className={styles.meta}>
        <span className={styles.dates}>
          {sprint.startDate} – {sprint.endDate}
        </span>
        <span className={styles.points}>{sprint.storyPoints} pts</span>
      </div>
    </div>
  )
}
