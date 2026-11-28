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
  LinkedInSection,
  PortfolioShell,
  QuestionsSection,
  ReadingSection,
  SectionBoundary,
  SkillsSection,
  SystemSection,
  WorkSection,
} from '@components/v5'

// [name for the error message, section]. Each one gets its own error
// boundary, so a crash in one section leaves the rest of the page working.
//
// The order tells the story: who I am (hero) → what I built (work) →
// proof (certificates) → what others say (LinkedIn) → what I know and
// read → the record (activity, experience) → how to work with me.
// Keep SECTION_META's numbers in ui.tsx in the same order.
const SECTIONS = [
  ['hero', HeroSection],
  ['work', WorkSection],
  ['case studies', CaseStudies],
  ['credentials', CredentialsSection],
  ['LinkedIn', LinkedInSection],
  ['skills', SkillsSection],
  ['reading', ReadingSection],
  ['GitHub', GitHubSection],
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
