/**
 * scrollTo.ts — Smooth Scroll Utility
 *
 * When a user clicks a nav link like "About", we scroll smoothly to that
 * section instead of jumping. While CSS scroll-behavior: smooth handles
 * anchor links, this JS helper gives us programmatic control (e.g., closing
 * the mobile menu first, then scrolling).
 */

/**
 * scrollToSection — smoothly scroll to an element by its id
 *
 * @param id - the element id WITHOUT the "#" (e.g. "about")
 */
export function scrollToSection(id: string): void {
  const element = document.getElementById(id)
  if (!element) return  // Element doesn't exist — do nothing

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',  // Align the top of the element with the top of the viewport
  })
}

/**
 * scrollToTop — smoothly scroll back to the top of the page
 * Used by the "back to top" button in the footer.
 */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
