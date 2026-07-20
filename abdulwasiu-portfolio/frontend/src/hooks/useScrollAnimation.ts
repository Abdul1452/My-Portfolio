/**
 * useScrollAnimation.ts — Fade-In-On-Scroll Trigger
 *
 * COMPOSING HOOKS:
 *   This hook doesn't reinvent scroll detection — it BUILDS ON
 *   useIntersectionObserver. This is a core React pattern: small hooks
 *   compose into bigger, more specific ones.
 *
 * WHAT IT RETURNS:
 *   - ref: attach to the element you want to animate
 *   - isVisible: true once the element has scrolled into view
 *   - className: a ready-to-use class string that applies the animation
 *
 * HOW COMPONENTS USE IT:
 *   const { ref, className } = useScrollAnimation()
 *   return <div ref={ref} className={className}>Fades in on scroll</div>
 *
 *   The element starts hidden (opacity 0, shifted down) and animates into
 *   place the first time it enters the viewport.
 *
 * WHY freezeOnceVisible IS TRUE HERE:
 *   For reveal animations you want the element to appear once and STAY.
 *   If it re-hid when scrolling back up, it would feel glitchy.
 */

import { useIntersectionObserver } from './useIntersectionObserver'

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
) {
  const {
    threshold = 0.15,
    // Reveal slightly before the element fully reaches the viewport bottom,
    // so it's already animating as it comes into view.
    rootMargin = '0px 0px -80px 0px',
  } = options

  const { ref, isIntersecting } = useIntersectionObserver<T>({
    threshold,
    rootMargin,
    freezeOnceVisible: true, // reveal once, keep visible
  })

  // Build the className string based on visibility.
  // These utility classes are defined in styles/animations.css and the
  // base hidden state. We toggle between hidden and the fade-in animation.
  const className = isIntersecting
    ? 'animate-fade-in-up'
    : 'opacity-0'

  return {
    ref,
    isVisible: isIntersecting,
    className,
  }
}
