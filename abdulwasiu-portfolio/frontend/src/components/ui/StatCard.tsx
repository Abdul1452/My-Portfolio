/**
 * StatCard.tsx — Numeric Stat Card (Hero)
 *
 * Small dark card showing a big number + label, e.g. "5+ / Years Exp."
 * Used in the hero stat row. Purely presentational.
 */

import styles from './StatCard.module.css'

interface StatCardProps {
  value: string   // "5+", "40+"
  label: string   // "Years Exp."
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  )
}
