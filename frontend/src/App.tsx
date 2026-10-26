/**
 * App.tsx — Route Definitions
 *
 * WHAT THIS FILE DOES:
 *   Maps URL paths to page components using React Router v6.
 *   Every page is wrapped in <PageWrapper> so the Navbar and Footer appear
 *   on every route (defined once, not per-page).
 *
 * HOW <Routes> AND <Route> WORK:
 *   <Routes> looks at the current URL and renders the FIRST <Route> whose
 *   `path` matches. Each <Route> pairs a path with an element to render.
 *
 *   path="/"               → HomePage
 *   path="/pm"             → PMGuidebookPage
 *   path="/projects/:slug" → ProjectDetailPage (:slug is dynamic)
 *   path="*"               → NotFoundPage (matches anything not matched above)
 *
 * THE "*" CATCH-ALL:
 *   Must come LAST. It matches any URL that no earlier route caught, so it's
 *   how we show a 404 page for unknown paths.
 */

import { Routes, Route } from 'react-router-dom'
import { PageWrapper } from '@layout'
import {
  CoastalHomePage,
  PMGuidebookPage,
  ProjectDetailPage,
  NotFoundPage,
} from '@pages'

// CoastalHomePage is a fully self-contained layout (its sidebar rail IS
// the site nav, with its own footer) — it renders standalone, without
// PageWrapper's top Navbar/Footer, which are designed for the other pages.
export function App() {
  return (
    <Routes>
      <Route path="/" element={<CoastalHomePage />} />
      <Route
        path="/pm"
        element={
          <PageWrapper>
            <PMGuidebookPage />
          </PageWrapper>
        }
      />
      <Route
        path="/projects/:slug"
        element={
          <PageWrapper>
            <ProjectDetailPage />
          </PageWrapper>
        }
      />
      {/* Catch-all — must be last */}
      <Route
        path="*"
        element={
          <PageWrapper>
            <NotFoundPage />
          </PageWrapper>
        }
      />
    </Routes>
  )
}
