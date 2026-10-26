/**
 * NotFoundPage.tsx — 404 Page
 *
 * Shown by the router's catch-all route ("*") when no other route matches.
 * Keep it simple, on-brand, and give a clear way back home.
 *
 * useNavigate:
 *   React Router's hook for programmatic navigation. navigate('/') sends the
 *   user to the home route without a full page reload (SPA behavior).
 */

import { useNavigate } from 'react-router-dom'
import { Button } from '@ui'
import { Section } from '@layout'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Section id="not-found" background="dark">
      <div style={{ textAlign: 'center', paddingBlock: '4rem' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-accent)',
            fontSize: 'var(--text-2xs)',
            letterSpacing: 'var(--tracking-widest)',
            textTransform: 'uppercase',
          }}
        >
          Error 404
        </p>
        <h1
          style={{
            fontSize: 'var(--text-hero)',
            fontWeight: 800,
            color: 'var(--color-ink-light)',
            margin: '1rem 0',
          }}
        >
          Page not found
        </h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: '2rem' }}>
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Button variant="primary" onClick={() => navigate('/')}>
          ← Back to home
        </Button>
      </div>
    </Section>
  )
}
