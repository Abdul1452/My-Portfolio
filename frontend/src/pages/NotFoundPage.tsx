/**
 * NotFoundPage.tsx — 404 page
 *
 * Rendered by the catch-all route (path="*") in App.tsx for any URL that
 * no other route matched. Uses PortfolioShell so even a wrong link lands
 * on a page with the normal header, footer and theme.
 */

import { Link } from 'react-router-dom'
import { PortfolioShell } from '@components/v5'

export function NotFoundPage() {
  return (
    <PortfolioShell>
      <section className="pf5-section" style={{ textAlign: 'center', paddingBlock: 'clamp(64px, 12vw, 140px)' }}>
        <p className="mono pf5-muted" style={{ fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase' }}>
          Error 404
        </p>
        <h1 className="pf5-h1" style={{ maxWidth: 'none', margin: '16px 0' }}>Page not found</h1>
        <p className="pf5-lead">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="pf5-actions" style={{ justifyContent: 'center', marginTop: 28 }}>
          <Link to="/" className="pf5-btn pf5-btn--primary pf5-btn--lg">Back to the portfolio</Link>
        </div>
      </section>
    </PortfolioShell>
  )
}
