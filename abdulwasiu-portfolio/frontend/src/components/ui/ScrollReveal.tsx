/**
 * ScrollReveal.tsx — Fade-In-On-Scroll Wrapper
 *
 * THE COMPOSITION PATTERN:
 *   This component wraps OTHER content via the `children` prop and gives it
 *   scroll-reveal behavior. Any content can be wrapped:
 *     <ScrollReveal><ProjectCard {...} /></ScrollReveal>
 *   The card will fade up into view the first time it's scrolled to.
 *
 * IT REUSES THE HOOK FROM PHASE 5:
 *   All the IntersectionObserver logic lives in useScrollAnimation.
 *   This component just connects that hook's ref + className to a wrapper div.
 *
 * THE delay PROP:
 *   Lets you stagger reveals — e.g. three cards revealing 0s, 0.1s, 0.2s apart
 *   creates a pleasing cascade instead of everything popping at once.
 */

import type { ReactNode, ElementType, CSSProperties } from 'react'
import { useScrollAnimation } from '@hooks/useScrollAnimation'
import { cn } from '@utils/cn'

interface ScrollRevealProps {
  children: ReactNode
  delay?: 1 | 2 | 3 | 4 | 5   // maps to .delay-N classes in animations.css
  className?: string
  style?: CSSProperties
  as?: ElementType            // render as div (default), section, li, etc.
}

export function ScrollReveal({
  children,
  delay,
  className,
  style,
  as: Tag = 'div',   // rename `as` to Tag; default to 'div'
}: ScrollRevealProps) {
  const { ref, className: animClass } = useScrollAnimation()

  return (
    <Tag
      ref={ref}
      className={cn(animClass, delay && `delay-${delay}`, className)}
      style={style}
    >
      {children}
    </Tag>
  )
}
