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
  SkillsSection,
  SystemSection,
  WorkSection,
} from '@components/v5'

export function PortfolioV5Page() {
  useEffect(() => {
    document.title = `${profile.name} — software engineering & project management`
  }, [])

  return (
    <PortfolioShell announcement>
      <HeroSection />
      <WorkSection />
      <CaseStudies />
      <SkillsSection />
      <GitHubSection />
      <CredentialsSection />
      <ExperienceSection />
      <ApproachSection />
      <QuestionsSection />
      <SystemSection />
      <ContactSection />
    </PortfolioShell>
  )
}
