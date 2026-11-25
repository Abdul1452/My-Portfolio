/**
 * PortfolioV5Page.tsx — The homepage ("Portfolio v5" design)
 *
 * Implements "Portfolio v5.dc.html" from Claude Design, filled with real
 * content from portfolio.data.ts (GitHub + LinkedIn).
 *
 * LAYOUT:
 *   PortfolioShell provides the header, footer, theme (dark by default) and
 *   the scroll-to-#section behaviour; this page only lists the sections.
 *   `announcement` adds the dark "open to work" bar above the header.
 */

import { useEffect } from 'react'
import { profile } from '@data/portfolio.data'
import {
  ApproachSection,
  CaseStudies,
  ContactSection,
  CredentialsSection,
  ExperienceSection,
  GitHubSection,
  HeroSection,
  PortfolioShell,
  QuestionsSection,
  SectionBoundary,
  SkillsSection,
  SystemSection,
  WorkSection,
} from '@components/v5'

// [name for the error message, section]. Each one gets its own error
// boundary, so a crash in one section leaves the rest of the page working.
const SECTIONS = [
  ['hero', HeroSection],
  ['work', WorkSection],
  ['case studies', CaseStudies],
  ['skills', SkillsSection],
  ['GitHub', GitHubSection],
  ['credentials', CredentialsSection],
  ['experience', ExperienceSection],
  ['how I work', ApproachSection],
  ['questions', QuestionsSection],
  ['system', SystemSection],
  ['contact', ContactSection],
] as const

export function PortfolioV5Page() {
  useEffect(() => {
    document.title = `${profile.name} — software engineering & project management`
  }, [])

  return (
    <PortfolioShell announcement>
      {SECTIONS.map(([name, Section]) => (
        <SectionBoundary key={name} name={name}>
          <Section />
        </SectionBoundary>
      ))}
    </PortfolioShell>
  )
}
