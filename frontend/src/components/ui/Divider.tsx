/**
 * Divider.tsx — Accent Divider Line
 *
 * A short accent-colored rule used under section headings. Can render a
 * short accent bar (default) or a full-width thin line.
 */

import { cn } from '@utils/cn'
import styles from './Divider.module.css'

interface DividerProps {
  variant?: 'accent' | 'full'
  className?: string
}

export function Divider({ variant = 'accent', className }: DividerProps) {
  return <div className={cn(styles.divider, styles[variant], className)} aria-hidden="true" />
}
