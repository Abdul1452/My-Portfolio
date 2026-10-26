/**
 * ProjectDetailPage.tsx — Dynamic Project Case Study (/projects/:slug)
 *
 * DYNAMIC ROUTES & URL PARAMS:
 *   The route is defined as "/projects/:slug" in App.tsx. The ":slug" part is
 *   a placeholder — visiting /projects/devconnect-hub makes slug = "devconnect-hub".
 *   useParams() reads that value from the URL.
 *
 * FINDING THE PROJECT:
 *   We look up the project in the useApp() data by matching slug. This is the
 *   SAME slug the backend uses, so the URL is stable whether data comes from
 *   the API or the static fallback.
 *
 * HANDLING "NOT FOUND":
 *   If no project matches the slug (bad URL, typo), we show a friendly message
 *   and a link back — never a blank screen or crash.
 */

import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '@hooks/useApp'
import { Section } from '@layout'
import { Button, Badge, SectionLabel } from '@ui'

export function ProjectDetailPage() {
  // useParams returns an object of the route's params. Our route has :slug.
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { projects } = useApp()

  // Find the matching project (or undefined if none).
  const project = projects.find(p => p.slug === slug)

  // ── Not found state ─────────────────────────────────────────────────────────
  if (!project) {
    return (
      <Section id="project-not-found" background="dark">
        <div style={{ textAlign: 'center', paddingBlock: '4rem' }}>
          <h1 style={{ color: 'var(--color-ink-light)', marginBottom: '1rem' }}>
            Project not found
          </h1>
          <p style={{ color: 'var(--color-muted)', marginBottom: '2rem' }}>
            No project matches &quot;{slug}&quot;.
          </p>
          <Button variant="primary" onClick={() => navigate('/')}>
            ← Back to home
          </Button>
        </div>
      </Section>
    )
  }

  // ── Found: render the case study ────────────────────────────────────────────
  return (
    <Section id="project-detail" background="light">
      <div style={{ maxWidth: '760px', marginInline: 'auto' }}>
        <SectionLabel label={project.tag} />

        <h1
          style={{
            fontSize: 'var(--text-h2)',
            fontWeight: 700,
            margin: '1rem 0',
          }}
        >
          {project.title}
        </h1>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <Badge>{project.year}</Badge>
          <Badge>{project.category === 'pm' ? 'Project Management' : 'Engineering'}</Badge>
          {project.featured && <Badge>Featured</Badge>}
        </div>

        <p
          style={{
            fontSize: 'var(--text-body-lg)',
            lineHeight: 1.8,
            color: 'var(--color-ink)',
            marginBottom: '2rem',
          }}
        >
          {project.description}
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {project.linkUrl && (
            <Button variant="primary" href={project.linkUrl} external>
              {project.linkLabel} →
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/')}>
            ← Back to home
          </Button>
        </div>
      </div>
    </Section>
  )
}
