/**
 * ProjectDetailPage.tsx — One project's detail page (/projects/:slug)
 *
 * HOW IT WORKS:
 *   useParams() reads the :slug part of the URL, e.g. /projects/petosvahti
 *   → slug = "petosvahti". We find the matching project in the list that
 *   AppContext loaded (from the API, or the static fallback when it's down).
 *   No match → a friendly "not found" message instead of a crash.
 *
 * LAYOUT:
 *   Rendered inside PortfolioShell, so it shares the homepage's header,
 *   footer and theme.
 */

import { Link, useParams } from 'react-router-dom'
import { useApp } from '@hooks/useApp'
import { PortfolioShell } from '@components/v5'

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { projects } = useApp()
  const project = projects.find(p => p.slug === slug)

  return (
    <PortfolioShell>
      <section className="pf5-section">
        <div style={{ maxWidth: 760 }}>
          <Link to="/#work" className="pf5-backlink">← Back to the portfolio</Link>

          {!project ? (
            <>
              <h1 className="pf5-h2" style={{ marginTop: 20 }}>Project not found</h1>
              <p className="pf5-lead">No project matches “{slug}”.</p>
            </>
          ) : (
            <>
              <div className="pf5-case__badges" style={{ marginTop: 20 }}>
                <span className="pf5-badge">{project.category === 'pm' ? 'Project management' : 'Engineering'}</span>
                <span className="pf5-badge pf5-badge--outline">{project.year}</span>
              </div>
              <h1 className="pf5-h2">{project.title}</h1>
              <p className="mono pf5-muted" style={{ fontSize: 13.5 }}>{project.tag}</p>
              <p className="pf5-lead" style={{ marginTop: 20 }}>{project.description}</p>
              {project.linkUrl && (
                <div className="pf5-actions" style={{ marginTop: 28 }}>
                  <a href={project.linkUrl} target="_blank" rel="noopener noreferrer" className="pf5-btn pf5-btn--primary pf5-btn--lg">
                    {project.linkLabel} ↗
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PortfolioShell>
  )
}
