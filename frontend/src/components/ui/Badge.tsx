/**
 * Badge.tsx — Small Colored Label Chip
 *
 * A "dumb" presentational component: it takes props and renders markup,
 * with no internal state or logic. Used for project category tags and
 * the "Available to hire" indicator (with the optional dot).
 */

import type { ReactNode } from 'react'
import { cn } from '@utils/cn'
import { AnimatedDot } from './AnimatedDot'
import styles from './Badge.module.css'

interface BadgeProps {
  children: ReactNode
  withDot?: boolean       // Show the pulsing green dot before the text
  className?: string
}

export function Badge({ children, withDot = false, className }: BadgeProps) {
  return (
    <span className={cn(styles.badge, className)}>
      {withDot && <AnimatedDot />}
      {children}
    </span>
  )
}
