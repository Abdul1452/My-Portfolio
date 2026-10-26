/**
 * GuidebookCard.tsx — PM Guidebook Feature Card
 *
 * A RICHER CARD:
 *   Unlike the simple PMCard, this one also lists the guidebook's chapters
 *   (topics). It takes a `chapters` string array and renders it as a list.
 *   This shows how to build a card that's more than title + description.
 *
 * PROPS:
 *   We pass the fields directly (title, description, chapters, linkUrl) rather
 *   than a full PMProject object, because this card has a bespoke shape (the
 *   chapter list) that the generic PMProject type doesn't include.
 */

import { Button } from '@ui'
import styles from './GuidebookCard.module.css'

interface GuidebookCardProps {
  title: string
  description: string
  chapters: string[]
  linkLabel: string
  linkUrl: string | null
}

export function GuidebookCard({
  title,
  description,
  chapters,
  linkLabel,
  linkUrl,
}: GuidebookCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.icon} aria-hidden="true">📖</div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        {linkUrl ? (
          <Button variant="primary" href={linkUrl} external>
            {linkLabel} →
          </Button>
        ) : (
          <span className={styles.soon}>{linkLabel} — coming soon</span>
        )}
      </div>

      {/* Right: table of contents */}
      <div className={styles.right}>
        <span className={styles.tocLabel}>Contents</span>
        <ol className={styles.toc} role="list">
          {chapters.map((chapter, i) => (
            <li key={i} className={styles.chapter}>
              <span className={styles.chapterNum}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {chapter}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
