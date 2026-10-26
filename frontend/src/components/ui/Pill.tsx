/**
 * Pill.tsx — Rounded Tech-Stack Label
 *
 * Used for the tech pills in the hero (React, TypeScript, Node.js...).
 * Distinct from Badge: pills sit on the DARK background and use a subtle
 * elevated surface rather than the teal tint.
 */

import { cn } from '@utils/cn'
import styles from './Pill.module.css'

interface PillProps {
  label: string
  className?: string
}

export function Pill({ label, className }: PillProps) {
  return <span className={cn(styles.pill, className)}>{label}</span>
}
