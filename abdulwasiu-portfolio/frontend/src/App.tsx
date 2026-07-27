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
  HomePage,
  PMGuidebookPage,
  ProjectDetailPage,
  NotFoundPage,
} from '@pages'

export function App() {
  return (
    <PageWrapper>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pm" element={<PMGuidebookPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        {/* Catch-all — must be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </PageWrapper>
  )
}
