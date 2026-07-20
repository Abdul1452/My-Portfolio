/**
 * useApp.ts — Hook to Consume the App Data Context
 *
 * Same pattern as useTheme, but for AppContext (projects, skills, pmProjects).
 * Sections like ProjectsSection and SkillsSection call this to read the data
 * that AppContext loaded (from the API, or the static fallback).
 *
 * Usage:
 *   const { projects, skills, status } = useApp()
 */

import { useContext } from 'react'
import { AppContext } from '@context/AppContext'

export function useApp() {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error(
      'useApp must be used within an <AppProvider>. ' +
      'Wrap your app (usually in main.tsx) with <AppProvider>.'
    )
  }

  return context
}
