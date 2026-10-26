/**
 * ThemeContext.tsx — Theme (Light/Dark) Global State
 *
 * WHAT IS REACT CONTEXT?
 *   A way to share state across the whole component tree WITHOUT passing
 *   props down manually through every level ("prop drilling").
 *
 * THE THREE PARTS OF A CONTEXT:
 *   1. createContext()  — creates the context object
 *   2. Provider          — wraps your app, holds the actual state
 *   3. useContext()      — how child components read the state
 *
 * WHAT THIS CONTEXT DOES:
 *   - Tracks whether the theme is 'light' or 'dark'
 *   - Persists the choice to localStorage (survives page reloads)
 *   - Applies the theme as a class on <html> (theme-light / theme-dark)
 *     so our CSS in globals.css can respond to it
 *   - Respects the user's OS preference on first visit
 */

import { createContext, useEffect, useState, type ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

// ─── Create the context ───────────────────────────────────────────────────────
//
// We export it so the useTheme hook (Phase 5) can consume it.
// The default value (undefined) is a sentinel — if a component tries to use
// this context WITHOUT a Provider above it, we can detect and warn.

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

// ─── localStorage key ─────────────────────────────────────────────────────────

const STORAGE_KEY = 'portfolio-theme'

// ─── Helper: determine the initial theme ──────────────────────────────────────
//
// Priority:
//   1. A previously saved choice in localStorage
//   2. The user's OS preference (prefers-color-scheme)
//   3. Fallback to 'light'

function getInitialTheme(): Theme {
  // Guard for SSR safety — window doesn't exist during server rendering.
  // (Not strictly needed for Vite SPA, but good habit.)
  if (typeof window === 'undefined') return 'light'

  // 1. Check localStorage
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved

  // 2. Check OS preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

// ─── The Provider component ───────────────────────────────────────────────────

interface ThemeProviderProps {
  children: ReactNode  // ReactNode = anything renderable (JSX, string, etc.)
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // useState with a function initializer — the function runs ONCE on mount.
  // This avoids re-reading localStorage on every render.
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  // useEffect runs after render. This one runs whenever `theme` changes.
  // It syncs the theme to (a) the <html> class and (b) localStorage.
  useEffect(() => {
    const html = document.documentElement  // this is <html>

    // Remove both classes, then add the current one.
    html.classList.remove('theme-light', 'theme-dark')
    html.classList.add(`theme-${theme}`)

    // Persist the choice so it survives reloads.
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])  // dependency array: re-run only when theme changes

  // Toggle between light and dark
  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  // Explicit setter
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  // The value object passed to all consumers
  const value: ThemeContextValue = { theme, toggleTheme, setTheme }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
