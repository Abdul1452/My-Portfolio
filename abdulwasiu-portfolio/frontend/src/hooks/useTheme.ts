/**
 * useTheme.ts — Hook to Consume the Theme Context
 *
 * WHAT THIS HOOK DOES:
 *   Provides clean access to the theme state (light/dark) and the
 *   toggleTheme / setTheme functions defined in ThemeContext.
 *
 * WHY WRAP useContext IN A CUSTOM HOOK?
 *   Without this hook, every component would write:
 *     const ctx = useContext(ThemeContext)
 *     if (!ctx) throw new Error(...)
 *     // then use ctx.theme
 *
 *   That's repetitive. This hook does it ONCE. Components just write:
 *     const { theme, toggleTheme } = useTheme()
 *
 * THE UNDEFINED CHECK (important pattern):
 *   ThemeContext's default value is `undefined`. It only becomes defined
 *   when a component is wrapped in <ThemeProvider>. If someone forgets to
 *   add the Provider, ctx is undefined — and we throw a CLEAR error telling
 *   them exactly what's wrong, instead of a confusing "cannot read theme
 *   of undefined" crash deep in a component.
 */

import { useContext } from 'react'
import { ThemeContext } from '@context/ThemeContext'

export function useTheme() {
  const context = useContext(ThemeContext)

  // This guard turns a confusing runtime error into a helpful one.
  if (context === undefined) {
    throw new Error(
      'useTheme must be used within a <ThemeProvider>. ' +
      'Wrap your app (usually in main.tsx) with <ThemeProvider>.'
    )
  }

  return context
}
