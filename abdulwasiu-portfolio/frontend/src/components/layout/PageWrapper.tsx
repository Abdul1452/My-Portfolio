/**
 * PageWrapper.tsx — Layout Composition Root
 *
 * THE SHELL ASSEMBLER:
 *   Wraps every page with the persistent chrome: Navbar on top, the page's
 *   content in <main>, and Footer at the bottom. Because pages render inside
 *   this, the nav and footer appear on every route without being repeated.
 *
 * SEMANTIC <main>:
 *   The page's unique content goes in a <main> landmark. Screen readers let
 *   users jump straight to <main>, and search engines treat it as the primary
 *   content. Only ONE <main> per page — which is exactly what this enforces.
 *
 * USAGE (in App.tsx, Phase 11):
 *   <PageWrapper><HomePage /></PageWrapper>
 */

import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

interface PageWrapperProps {
  children: ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <>
      <Navbar />
      {/* The page's main content. Only one <main> per page. */}
      <main>{children}</main>
      <Footer />
    </>
  )
}
