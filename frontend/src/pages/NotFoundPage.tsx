/**
 * NotFoundPage.tsx — 404 page
 *
 * Rendered by the catch-all route (path="*") in App.tsx for any URL that
 * no other route matched. Uses PortfolioShell so even a wrong link lands
 * on a page with the normal header, footer and theme.
 *
 * v6: a small "lost orbit" drawing that echoes the 3D hero, same words.
 */

import { Link } from 'react-router-dom'
import { Compass, House } from 'lucide-react'
import { PortfolioShell } from '@components/v5'

function LostOrbit() {
  return (
    <svg className="pf6-lost" viewBox="0 0 220 160" aria-hidden="true">
      <ellipse cx="110" cy="80" rx="100" ry="40" fill="none" style={{ stroke: 'var(--line-strong)' }} strokeWidth="1.5" strokeDasharray="4 6" />
      <circle cx="29" cy="75" r="5" style={{ fill: 'var(--scene-stack)' }} />
      <circle cx="184" cy="104" r="4" style={{ fill: 'var(--scene-project)' }} opacity="0.9" />
      <circle cx="153" cy="47" r="3" style={{ fill: 'var(--scene-pm)' }} opacity="0.7" />
      <circle cx="110" cy="80" r="32" style={{ fill: 'var(--surface)', stroke: 'var(--line-strong)' }} />
      <foreignObject x="96" y="66" width="28" height="28">
        <Compass size={28} style={{ color: 'var(--accent-text)' }} />
      </foreignObject>
    </svg>
  )
}

export function NotFoundPage() {
  return (
    <PortfolioShell>
      <section className="pf5-section" style={{ textAlign: 'center', paddingBlock: 'clamp(64px, 12vw, 140px)' }}>
        <LostOrbit />
        <p className="mono pf5-muted" style={{ fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase' }}>
          Error 404
        </p>
        <h1 className="pf5-h1" style={{ maxWidth: 'none', margin: '16px 0' }}>Page not found</h1>
        <p className="pf5-lead">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="pf5-actions" style={{ justifyContent: 'center', marginTop: 28 }}>
          <Link to="/" className="pf5-btn pf5-btn--primary pf5-btn--lg">
            <House size={18} aria-hidden="true" /> Back to the portfolio
          </Link>
        </div>
      </section>
    </PortfolioShell>
  )
}
