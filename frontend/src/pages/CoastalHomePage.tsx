/**
 * CoastalHomePage.tsx — Sidebar-Rail Portfolio Homepage
 *
 * Implements "Portfolio Coastal.dc.html" from the Claude Design project
 * "Portfolio redesign for Finnish market". This is a fully self-contained
 * layout — the sidebar rail IS the site nav — so it renders standalone in
 * App.tsx rather than inside <PageWrapper> (which would add a duplicate
 * top Navbar + Footer designed for the old dark/Sora homepage).
 *
 * The previous single-page HomePage (Hero/About/Skills/Projects/PM/
 * Contact under the top navbar) still exists at pages/HomePage.tsx and its
 * components are untouched — only the route it's mounted on changed.
 */

import {
  CoastalSidebar,
  CoastalOverviewSection,
  CoastalProjectsSection,
  CoastalDeliverySection,
  CoastalSkillsSection,
  CoastalCertificatesSection,
  CoastalContactSection,
} from '@coastal'

export function CoastalHomePage() {
  const year = new Date().getFullYear()

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] bg-coastal-cream font-coastal-body text-coastal-ink">
      <CoastalSidebar />

      <main className="min-w-0 flex-1">
        <CoastalOverviewSection />
        <CoastalProjectsSection />
        <CoastalDeliverySection />
        <CoastalSkillsSection />
        <CoastalCertificatesSection />
        <CoastalContactSection />

        <footer className="flex justify-between gap-4 px-12 py-[18px] font-coastal-mono text-[11px] text-coastal-ink/45">
          <span>© {year} Abdulwasiu Abdullahi Olamilekan</span>
        </footer>
      </main>
    </div>
  )
}
