/**
 * SectionLabel.tsx — Overline Label Above Section Headings
 *
 * Renders the "01 — ABOUT" style mono label. The number encodes the real
 * reading order of the page (About is section 1, Skills is 2, etc.), which
 * is why numbering is appropriate here — it reflects a true sequence.
 */

import { cn } from '@utils/cn'
import styles from './SectionLabel.module.css'

interface SectionLabelProps {
  number?: string   // "01", "02" — optional
  label: string     // "About", "Skills"
  className?: string
}

export function SectionLabel({ number, label, className }: SectionLabelProps) {
  return (
    <span className={cn(styles.label, className)}>
      {number && <span className={styles.number}>{number} — </span>}
      {label}
    </span>
  )
}
