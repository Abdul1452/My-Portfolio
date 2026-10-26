/**
 * AnimatedDot.tsx — Pulsing Green Availability Dot
 *
 * A tiny atom: just a pulsing dot. Used inside the "Available to hire" badge.
 * The pulse animation is defined in styles/animations.css.
 */

import styles from './AnimatedDot.module.css'

export function AnimatedDot() {
  // aria-hidden: this dot is decorative, so we hide it from screen readers.
  return <span className={styles.dot} aria-hidden="true" />
}
