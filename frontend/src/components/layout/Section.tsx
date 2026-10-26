/**
 * Section.tsx — Consistent Section Wrapper
 *
 * A layout PRIMITIVE: the simplest reusable building block for page layout.
 * Every major section (About, Skills, Projects...) wraps its content in one.
 *
 * WHAT IT PROVIDES:
 *   - Consistent horizontal + vertical padding (from tokens)
 *   - An `id` so nav links can scroll to it (<a href="#about">)
 *   - A background variant (light or dark) matching the alternating design
 *   - An inner container that constrains content to the max width
 *
 * WHY BUILD THIS ONCE:
 *   Without it, every section would repeat the same padding values. Change
 *   the spacing once here and every section updates together.
 *
 * scroll-margin-top:
 *   Applied via CSS so that when you scroll to #about, the fixed navbar
 *   doesn't cover the section's top. (Also set globally, but explicit here.)
 */

import type { ReactNode } from 'react'
import { cn } from '@utils/cn'
import styles from './Section.module.css'

interface SectionProps {
  id: string
  children: ReactNode
  background?: 'light' | 'dark'
  className?: string
}

export function Section({ id, children, background = 'light', className }: SectionProps) {
  return (
    <section id={id} className={cn(styles.section, styles[background], className)}>
      {/* Inner container centers + constrains content width */}
      <div className={styles.container}>{children}</div>
    </section>
  )
}
