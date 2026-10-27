/**
 * App.tsx — Route Definitions
 *
 * WHAT THIS FILE DOES:
 *   Maps URL paths to page components using React Router v6.
 *
 * HOW <Routes> AND <Route> WORK:
 *   <Routes> looks at the current URL and renders the FIRST <Route> whose
 *   `path` matches. Each <Route> pairs a path with an element to render.
 *
 *   path="/"               → PortfolioV5Page (the homepage)
 *   path="/pm"             → PMGuidebookPage (the project management guidebook)
 *   path="/projects/:slug" → ProjectDetailPage (:slug is dynamic)
 *   path="*"               → NotFoundPage (matches anything not matched above)
 *
 * LAYOUT:
 *   Every page renders its own <PortfolioShell> (header, footer, theme), so
 *   there's no layout wrapper here.
 *
 * THE "*" CATCH-ALL:
 *   Must come LAST. It matches any URL that no earlier route caught, so it's
 *   how we show a 404 page for unknown paths.
 */

import { Routes, Route } from 'react-router-dom'
import {
  PortfolioV5Page,
  PMGuidebookPage,
  ProjectDetailPage,
  NotFoundPage,
} from '@pages'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioV5Page />} />
      <Route path="/pm" element={<PMGuidebookPage />} />
      <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      {/* Catch-all — must be last */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
