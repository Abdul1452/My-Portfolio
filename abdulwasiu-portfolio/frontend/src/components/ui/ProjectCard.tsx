/**
 * ProjectCard.tsx — Engineering Project Card
 *
 * DATA-DRIVEN:
 *   Receives a full `Project` object (the type from Phase 3) and lays out its
 *   fields: thumbnail, tag, year, title, description, and a link button.
 *   TypeScript guarantees the object is complete and correctly shaped.
 *
 * CONDITIONAL LINK:
 *   linkUrl can be null (project has no link yet). We only render the link
 *   button when linkUrl exists — otherwise we show a non-clickable label.
 *
 * IMAGE PLACEHOLDER:
 *   Until real screenshots exist (imageUrl is null), we show a styled
 *   placeholder. When you add imageUrl later, it renders the real image.
 */

import type { Project } from '@types'
import { Button } from './Button'
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { title, tag, description, year, linkLabel, linkUrl, imageUrl } = project

  return (
    <article className={styles.card}>
      {/* Top accent bar */}
      <div className={styles.topBar} aria-hidden="true" />

      {/* Thumbnail: real image if available, else a placeholder */}
      <div className={styles.thumb}>
        {imageUrl ? (
          <img src={imageUrl} alt={`${title} screenshot`} className={styles.thumbImg} />
        ) : (
          <span className={styles.thumbPlaceholder}>[ Screenshot ]</span>
        )}
        <span className={styles.yearBadge}>{year}</span>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.tag}>{tag}</div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        {/* Only render a real link if the project has one */}
        {linkUrl ? (
          <Button variant="ghost" href={linkUrl} external className={styles.link}>
            {linkLabel} →
          </Button>
        ) : (
          <span className={styles.linkDisabled}>{linkLabel} — coming soon</span>
        )}
      </div>
    </article>
  )
}
