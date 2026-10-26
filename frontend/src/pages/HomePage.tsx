/**
 * HomePage.tsx — The Main Portfolio Page
 *
 * WHAT A PAGE IS:
 *   A page maps to a URL ("/") and arranges SECTIONS in order. It holds no
 *   logic of its own — each section manages its own data and behavior. The
 *   page is purely the running order of the show.
 *
 * SCROLL ORDER:
 *   Hero → About → Skills → Projects → PM → Contact
 *   This is the narrative arc: hook them, introduce yourself, prove skills,
 *   show work, show PM depth, then invite contact.
 *
 * Note: Navbar and Footer are NOT here — they live in PageWrapper (Phase 7),
 * which wraps this page in App.tsx. That keeps them on every route.
 */

import {
  HeroSection,
  AboutSection,
  SkillsSection,
  ProjectsSection,
  ContactSection,
} from '@sections'
import { PMSection } from '@pm'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <PMSection />
      <ContactSection />
    </>
  )
}
