/**
 * FactCard.tsx — Key/Value Fact Card (About section)
 *
 * Shows a labeled fact like:
 *   LOCATION
 *   Turku, Finland 🇫🇮
 * Used in the About section's fact grid. The `fact` prop shape matches
 * the AboutFact type from meta.data.ts.
 */

import styles from './FactCard.module.css'

interface FactCardProps {
  factKey: string    // "Location" (renamed from `key` — `key` is reserved in React)
  value: string      // "Turku, Finland 🇫🇮"
}

export function FactCard({ factKey, value }: FactCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.key}>{factKey}</div>
      <div className={styles.value}>{value}</div>
    </div>
  )
}
