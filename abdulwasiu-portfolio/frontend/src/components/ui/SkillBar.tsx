/**
 * SkillBar.tsx — Animated Skill Progress Bar
 *
 * WHAT IT SHOWS:
 *   A labeled bar: the skill name, a track, and a fill that represents the
 *   proficiency percentage. The fill animates from 0 → target% WHEN the bar
 *   scrolls into view (not on page load — that would be missed above the fold).
 *
 * HOW THE ANIMATION WORKS:
 *   - useScrollAnimation gives us `isVisible` (true once scrolled to).
 *   - The fill's width is 0 until visible, then set to `${percentage}%`.
 *   - CSS transitions the width change smoothly (see the .module.css).
 *
 * INLINE STYLE FOR DYNAMIC WIDTH:
 *   The percentage is data-driven (comes from props), so we can't hardcode it
 *   in CSS. We set it via the style={{ width }} prop — the one legit case for
 *   inline styles: truly dynamic, per-instance values.
 *
 * ACCESSIBILITY:
 *   We add role="progressbar" + aria-valuenow so screen readers announce
 *   "React, 92 percent". Visual bars are meaningless without this for
 *   non-sighted users.
 */

import { useScrollAnimation } from '@hooks/useScrollAnimation'
import styles from './SkillBar.module.css'

interface SkillBarProps {
  name: string
  percentage: number   // 0-100
}

export function SkillBar({ name, percentage }: SkillBarProps) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div className={styles.skill} ref={ref}>
      <div className={styles.header}>
        <span className={styles.name}>{name}</span>
        <span className={styles.percent}>{percentage}%</span>
      </div>

      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={name}
      >
        <div
          className={styles.fill}
          // Dynamic width: 0 until visible, then the real percentage.
          // The CSS transition animates the change smoothly.
          style={{ width: isVisible ? `${percentage}%` : '0%' }}
        />
      </div>
    </div>
  )
}
