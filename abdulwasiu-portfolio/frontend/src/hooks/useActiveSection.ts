/**
 * useActiveSection.ts — Scroll-Spy for a Fixed Sidebar Nav
 *
 * WHAT IT DOES:
 *   Watches a list of section ids and reports which one is currently
 *   nearest the top of the viewport, so a sidebar nav (CoastalSidebar) can
 *   highlight the link for the section the user is actually reading.
 *
 * WHY NOT useIntersectionObserver DIRECTLY:
 *   That hook reports one boolean per element. Here we need to compare ALL
 *   sections at once and pick the "most current" one, so this hook runs its
 *   own single IntersectionObserver over every id and keeps the best match
 *   in state instead of composing several boolean hooks.
 */

import { useEffect, useState } from 'react'

export function useActiveSection(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    const elements = ids
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        // Among sections currently crossing the trigger band, the one
        // closest to the top of the viewport is "active".
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        // A thin band near the top of the viewport — a section becomes
        // "active" once its top has scrolled up into it.
        rootMargin: '-15% 0px -70% 0px',
        threshold: 0,
      }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return activeId
}
