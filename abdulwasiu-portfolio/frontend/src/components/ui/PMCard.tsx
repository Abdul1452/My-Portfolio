/**
 * PMCard.tsx — Project Management Deliverable Card
 *
 * Similar to ProjectCard but for PM projects: dark card, an emoji icon
 * instead of a screenshot, and the PMProject data shape. Used in the PM
 * section to showcase the Guidebook, Gantt tool, and Sprint planner.
 */

import type { PMProject } from '@app-types'
import { Button } from './Button'
import styles from './PMCard.module.css'

interface PMCardProps {
  pmProject: PMProject
}

export function PMCard({ pmProject }: PMCardProps) {
  const { title, tag, description, icon, linkLabel, linkUrl } = pmProject

  return (
    <article className={styles.card}>
      <div className={styles.icon} aria-hidden="true">{icon}</div>
      <div className={styles.tag}>{tag}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      {linkUrl ? (
        <Button variant="ghost" href={linkUrl} external className={styles.link}>
          {linkLabel} →
        </Button>
      ) : (
        <span className={styles.linkDisabled}>{linkLabel} — coming soon</span>
      )}
    </article>
  )
}
