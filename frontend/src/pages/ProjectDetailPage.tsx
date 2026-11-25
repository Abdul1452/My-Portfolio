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
 *
 * v6 STATES:
 *   loading   skeleton in the final layout's shape while AppContext fetches
 *   fallback  a quiet banner when the API was down and saved data is shown
 *   not found an empty state with a way back
 */

import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Github, SearchX } from 'lucide-react'
import { useApp } from '@hooks/useApp'
import { Banner, parseGitHubUrl, PortfolioShell, Skeleton, StackPills } from '@components/v5'

/** GitHub's generated preview card for a repository URL, if it is one. */
function repoPreview(url: string | null | undefined): string | null {
  const parsed = parseGitHubUrl(url)
  if (!parsed) return null
  const [owner, repo] = parsed.pathname.split('/').filter(Boolean)
  if (!owner || !repo) return null
  return `https://opengraph.githubassets.com/portfolio/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { projects, status, usingFallback } = useApp()
  const [fallbackDismissed, setFallbackDismissed] = useState(false)
  const project = projects.find(p => p.slug === slug)
  const preview = project ? project.imageUrl ?? repoPreview(project.linkUrl) : null

  return (
    <PortfolioShell>
      <section className="pf5-section" aria-busy={status === 'loading'}>
        <Link to="/#work" className="pf5-backlink pf6-iconrow">
          <ArrowLeft size={16} aria-hidden="true" /> Back to the portfolio
        </Link>

        {usingFallback && !fallbackDismissed && (
          <div style={{ margin: '16px 0 4px' }}>
            <Banner tone="info" title="Live data unavailable" onDismiss={() => setFallbackDismissed(true)}>
              The API didn’t answer, so you’re seeing the saved copy of the projects. Everything still works.
            </Banner>
          </div>
        )}

        {status === 'loading' ? (
          <div className="pf6-detail" style={{ marginTop: 20 }}>
            <p className="pf5-sr-only" role="status">Loading project</p>
            <div className="pf6-detail__main" style={{ display: 'grid', gap: 14 }}>
              <Skeleton width={160} height={22} />
              <Skeleton width="60%" height={40} />
              <Skeleton height={16} />
              <Skeleton width="85%" height={16} />
            </div>
            <div className="pf6-detail__visual"><Skeleton height={180} style={{ borderRadius: 16 }} /></div>
          </div>
        ) : !project ? (
          <div style={{ marginTop: 32 }}>
            <div className="pf6-empty">
              <span className="pf6-empty__ring" aria-hidden="true"><SearchX size={28} /></span>
              <h1 className="pf6-empty__title">Project not found</h1>
              <p className="pf6-empty__body">No project matches “{slug}”.</p>
              <Link to="/#work" className="pf5-btn pf5-btn--ghost">
                <ArrowLeft size={16} aria-hidden="true" /> Back to the portfolio
              </Link>
            </div>
          </div>
        ) : (
          <div className="pf6-detail" style={{ marginTop: 20 }}>
            <div className="pf6-detail__main">
              <div className="pf5-case__badges">
                <span className="pf5-badge">{project.category === 'pm' ? 'Project management' : 'Engineering'}</span>
                <span className="pf5-badge pf5-badge--outline">{project.year}</span>
              </div>
              <h1 className="pf5-h2">{project.title}</h1>
              <StackPills stack={project.tag} label="Tags" />
              <p className="pf5-lead" style={{ marginTop: 20 }}>{project.description}</p>
              {project.linkUrl && (
                <div className="pf5-actions" style={{ marginTop: 28 }}>
                  <a href={project.linkUrl} target="_blank" rel="noopener noreferrer" className="pf5-btn pf5-btn--primary pf5-btn--lg">
                    {parseGitHubUrl(project.linkUrl) && <Github size={18} aria-hidden="true" />}
                    {project.linkLabel} <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
            {preview && (
              <figure className="pf6-detail__visual" style={{ margin: 0 }}>
                <div className="pf6-detail__shot">
                  <img src={preview} alt={`Preview card for ${project.title}`} loading="lazy" width={1200} height={600} />
                </div>
                <figcaption className="pf5-muted" style={{ fontSize: 12.5 }}>Preview card generated by GitHub for the repository.</figcaption>
              </figure>
            )}
          </div>
        )}
      </section>
    </PortfolioShell>
  )
}
