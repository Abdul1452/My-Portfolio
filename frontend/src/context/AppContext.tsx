/**
 * AppContext.tsx — Global App Data (Projects, Skills, PM Projects)
 *
 * WHAT THIS CONTEXT DOES:
 *   Loads the portfolio's content (projects, skills, PM projects) ONCE when
 *   the app starts, and makes it available to every section component.
 *
 * WHY LOAD IT HERE INSTEAD OF IN EACH SECTION?
 *   If ProjectsSection and SkillsSection each fetched their own data, and
 *   the user scrolled up and down, you might re-fetch repeatedly. Loading
 *   once at the top and sharing via context is efficient and simple.
 *
 * THE GRACEFUL FALLBACK PATTERN:
 *   The backend might not be running yet (you're still learning!), or might
 *   be down. So we TRY the API first, and if it fails, we fall back to the
 *   static data in src/data/. This means the portfolio ALWAYS renders —
 *   even with no backend. Very important for a portfolio that must never
 *   look broken to a recruiter.
 *
 * LOADING STATES:
 *   status: 'loading' | 'ready' | 'error'
 *   Components can show skeletons while loading, then the real content.
 */

import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { Project, PMProject, SkillCategory } from '@app-types'
import { api } from '@utils/api'
// Static fallback data (Phase 4 — created next session).
// These imports work once we write the data files; for now they're referenced.
import { projects as staticProjects } from '@data/projects.data'
import { pmProjects as staticPMProjects } from '@data/pm-projects.data'
import { skillCategories as staticSkills } from '@data/skills.data'

// ─── Types ────────────────────────────────────────────────────────────────────

type LoadStatus = 'loading' | 'ready' | 'error'

interface AppContextValue {
  projects: Project[]
  pmProjects: PMProject[]
  skills: SkillCategory[]
  status: LoadStatus
  usingFallback: boolean  // true if we're showing static data (API failed)
}

// ─── Create the context ───────────────────────────────────────────────────────

export const AppContext = createContext<AppContextValue | undefined>(undefined)

// ─── The Provider ─────────────────────────────────────────────────────────────

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [pmProjects, setPMProjects] = useState<PMProject[]>([])
  const [skills, setSkills] = useState<SkillCategory[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    // We define an async function INSIDE useEffect because useEffect
    // callbacks themselves cannot be async (they must return void or a
    // cleanup function, not a Promise).
    async function loadData() {
      try {
        // Promise.all runs all three requests IN PARALLEL, not one-by-one.
        // This is faster than awaiting each sequentially.
        const [projectsData, pmData, skillsData] = await Promise.all([
          api.get<Project[]>('/projects'),
          api.get<PMProject[]>('/pm-projects'),
          api.get<SkillCategory[]>('/skills'),
        ])

        setProjects(projectsData)
        setPMProjects(pmData)
        setSkills(skillsData)
        setStatus('ready')
      } catch (error) {
        // API failed — fall back to static data so the site still works.
        // We log it for debugging but the USER sees a fully working portfolio.
        console.warn(
          '[AppContext] API unavailable, using static fallback data.',
          error
        )
        setProjects(staticProjects)
        setPMProjects(staticPMProjects)
        setSkills(staticSkills)
        setUsingFallback(true)
        setStatus('ready')  // still 'ready' — we HAVE data, just static
      }
    }

    loadData()
  }, [])  // empty dependency array = run ONCE on mount

  const value: AppContextValue = {
    projects,
    pmProjects,
    skills,
    status,
    usingFallback,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
