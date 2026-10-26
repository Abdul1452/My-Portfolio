/**
 * useMobileMenu.ts — Hamburger Menu Open/Close State
 *
 * WHAT THIS HOOK MANAGES:
 *   1. The open/closed boolean state
 *   2. open() / close() / toggle() functions
 *   3. SIDE EFFECTS that should happen based on that state:
 *      - Lock body scroll while the menu is open (so the page behind
 *        doesn't scroll under the overlay)
 *      - Close the menu when the user presses the Escape key
 *
 * useCallback EXPLAINED:
 *   Normally a new function is created on every render. useCallback "memoizes"
 *   the function so the SAME function reference persists across renders (until
 *   its dependencies change). This matters when passing functions to child
 *   components or effect dependency arrays — it prevents unnecessary re-runs.
 *
 * WHY LOCK BODY SCROLL:
 *   When a full-screen mobile menu is open, scrolling should move the MENU,
 *   not the page behind it. Setting body overflow: hidden freezes the page.
 *   We restore it when the menu closes. This is a common, important UX detail.
 */

import { useState, useCallback, useEffect } from 'react'

export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  // useCallback keeps these function references stable across renders.
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  // ── Side effect 1: lock/unlock body scroll ──────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      // Save the current overflow so we can restore it exactly.
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      // Cleanup restores scroll when menu closes or component unmounts.
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [isOpen])

  // ── Side effect 2: close on Escape key ──────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return // only listen while open

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Cleanup: remove the listener. Forgetting this would stack up listeners
    // every time the menu opens — a classic memory leak.
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  return { isOpen, open, close, toggle }
}
