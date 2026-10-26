/**
 * ProjectsSection.tsx — Engineering Projects with Filter Tabs
 *
 * INTERACTIVITY — FILTER TABS:
 *   The user can filter projects (All / Featured). We track the active filter
 *   with useState, then DERIVE the visible list from it on each render.
 *
 * DERIVED STATE (important concept):
 *   We do NOT store the filtered array in state. Instead we compute it:
 *     const visible = filter === 'featured'
 *       ? projects.filter(p => p.featured)
 *       : projects
 *   Storing derived data in state causes bugs (two sources of truth that can
 *   drift). The rule: if you can COMPUTE it from existing state/props, do that
 *   instead of storing it.
 *
 * DATA:
 *   projects from useApp() (API or fallback).
 */

import { useState } from 'react'
import { Section } from '@layout'
import { SectionLabel, ProjectCard, ScrollReveal } from '@ui'
import { useApp } from '@hooks/useApp'
import { cn } from '@utils/cn'
import styles from './ProjectsSection.module.css'

// The filter options for the tabs.
type Filter = 'all' | 'featured'

export function ProjectsSection() {
  const { projects, status } = useApp()
  const [filter, setFilter] = useState<Filter>('all')

  // DERIVED: compute the visible list from projects + filter (not stored).
  const visibleProjects =
    filter === 'featured' ? projects.filter(p => p.featured) : projects

  return (
    <Section id="projects" background="light">
      <ScrollReveal>
        <SectionLabel number="03" label="Selected Work" />
        <h2 className={styles.title}>Engineering Projects</h2>
      </ScrollReveal>

      {/* Filter tabs */}
      <ScrollReveal className={styles.tabs}>
        <button
          className={cn(styles.tab, filter === 'all' && styles.tabActive)}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={cn(styles.tab, filter === 'featured' && styles.tabActive)}
          onClick={() => setFilter('featured')}
        >
          Featured
        </button>
      </ScrollReveal>

      {status === 'loading' ? (
        <div className={styles.skeleton}>Loading projects…</div>
      ) : (
        <div className={styles.grid}>
          {visibleProjects.map(project => (
            <ScrollReveal key={project.id}>
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </Section>
  )
}
