/**
 * usePortfolioTheme.ts — Light/dark theme + reduced motion for Portfolio v5
 *
 * WHAT IT RETURNS:
 *   theme         'light' | 'dark' — the page sets it as data-theme on its
 *                 wrapper, and portfolio-v5.css swaps every colour token.
 *   toggleTheme   flips the theme and remembers the choice in localStorage.
 *   reduceMotion  true when the OS asks for less motion; the page then sets
 *                 data-motion="reduce" and the CSS switches animations off.
 *
 * WHY NOT THE EXISTING ThemeContext?
 *   ThemeContext styles the whole <html> element for the older pages. This
 *   design scopes its theme to its own wrapper, so the two can't fight.
 *
 * WHY try/catch AROUND localStorage?
 *   Private windows and blocked site data can make localStorage throw.
 *   The theme should still work then — it just won't be remembered.
 */

import { useCallback, useEffect, useState } from 'react'

export type PortfolioTheme = 'light' | 'dark'

const STORAGE_KEY = 'pf5-theme'

function readSavedTheme(): PortfolioTheme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Storage unavailable — fall through to the default.
  }
  return 'light' // the design's default
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

export function usePortfolioTheme() {
  const [theme, setTheme] = useState<PortfolioTheme>(readSavedTheme)
  const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion)

  // Follow the OS setting if it changes while the page is open.
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!query) return
    const onChange = () => setReduceMotion(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(current => {
      const next: PortfolioTheme = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Storage unavailable — the toggle still works for this visit.
      }
      return next
    })
  }, [])

  return { theme, toggleTheme, reduceMotion }
}
