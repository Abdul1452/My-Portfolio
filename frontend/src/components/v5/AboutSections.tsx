/**
 * AboutSections.tsx — How I work, recruiter questions, the site's system, contact
 *
 * The "working with me" half of the page. Like ProfileSections, each
 * section returns null when its data in portfolio.data.ts is empty.
 */

import { useEffect, useRef, useState } from 'react'
import { contact, faqs, fit, profile, workingSteps } from '@data/portfolio.data'
import { usePortfolioThemeContext } from './usePortfolioTheme'

// ─── How I work ───────────────────────────────────────────────────────────────

export function ApproachSection() {
  if (!workingSteps.length && !fit.good.length) return null

  return (
    <section id="approach" data-screen-label="How I work" className="pf5-section">
      <div style={{ maxWidth: 640, marginBottom: 'clamp(24px, 4vw, 36px)' }}>
        <h2 className="pf5-h2">How I work</h2>
        <p className="pf5-lead">Here is where I’d be useful and where I wouldn’t, so neither of us wastes an interview.</p>
      </div>

      {fit.good.length > 0 && (
        <div className="pf5-fit">
          <div className="pf5-fit__card">
            <h3>
              <span aria-hidden="true" className="pf5-fit__icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </span>
              A good fit if
            </h3>
            <ul>{fit.good.map(line => <li key={line}>{line}</li>)}</ul>
          </div>
          <div className="pf5-fit__card">
            <h3>
              <span aria-hidden="true" className="pf5-fit__icon pf5-fit__icon--no">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </span>
              Probably not a fit if
            </h3>
            <ul>{fit.notGood.map(line => <li key={line}>{line}</li>)}</ul>
          </div>
        </div>
      )}

      <ol className="pf5-steps">
        {workingSteps.map((step, i) => (
          <li key={step.title}>
            <p className="mono">{String(i + 1).padStart(2, '0')}</p>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

// ─── Questions recruiters ask (accordion) ─────────────────────────────────────

export function QuestionsSection() {
  // Index of the open answer; -1 = all closed. The first starts open.
  const [open, setOpen] = useState(0)
  if (!faqs.length) return null

  return (
    <section data-screen-label="Questions" className="pf5-section pf5-split">
      <div className="pf5-split__intro">
        <h2 className="pf5-h2">Questions recruiters ask</h2>
        <p className="pf5-lead">If yours isn’t here, email me.</p>
      </div>
      <div className="pf5-split__body pf5-faq">
        {faqs.map((faq, i) => {
          const isOpen = open === i
          return (
            <div key={faq.q} className="pf5-faq__item">
              <h3 style={{ margin: 0 }}>
                <button
                  type="button"
                  className="pf5-faq__q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{faq.q}</span>
                  <span aria-hidden="true" className="pf5-faq__icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                </button>
              </h3>
              {isOpen && <p id={`faq-${i}`} className="pf5-faq__a">{faq.a}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── How this site is built ───────────────────────────────────────────────────

const TOKENS = ['--bg', '--surface', '--ink', '--accent', '--ok', '--danger']
const COMPONENTS = ['Button', 'Badge', 'Card', 'Timeline', 'Accordion', 'Copy button', 'Theme switch', 'Announcement bar']

export function SystemSection() {
  const { theme, toggleTheme: onToggleTheme } = usePortfolioThemeContext()
  const isDark = theme === 'dark'

  return (
    <section data-screen-label="System" className="pf5-section">
      <div className="pf5-box" style={{ padding: 'clamp(20px, 4vw, 44px)' }}>
        <div className="pf5-sectionhead" style={{ marginBottom: 28 }}>
          <div style={{ maxWidth: 560 }}>
            <h2 className="pf5-h3" style={{ fontSize: 'clamp(24px, 3vw, 32px)', letterSpacing: '-.03em', marginBottom: 10 }}>
              How this site is built
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--ink-2)' }}>
              React, TypeScript and Vite on the front end, with an Express, Prisma and PostgreSQL API behind it.
              The page is a small design system: semantic tokens, a short list of components, and one primary
              action on each surface. Switch the theme to see the same tokens resolve to other values.
            </p>
          </div>
          <button type="button" className="pf5-btn pf5-btn--ghost" aria-pressed={isDark} onClick={onToggleTheme} style={{ alignSelf: 'start' }}>
            {isDark ? 'Switch to light' : 'Switch to dark'}
          </button>
        </div>

        <div className="pf5-system">
          <div>
            <h3>Tokens</h3>
            <ul className="pf5-tokens">
              {TOKENS.map(token => (
                <li key={token}>
                  <span aria-hidden="true" className="pf5-swatch" style={{ background: `var(${token})` }} />
                  {token}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Type scale</h3>
            <div style={{ display: 'grid', gap: 6 }}>
              <p style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-.04em', lineHeight: 1.1 }}>Display</p>
              <p style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-.03em' }}>Heading</p>
              <p style={{ fontSize: 17, fontWeight: 600 }}>Title</p>
              <p style={{ fontSize: 15.5, color: 'var(--ink-2)' }}>Body text, Onest</p>
              <p className="mono" style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>Code, JetBrains Mono</p>
            </div>
          </div>
          <div>
            <h3>Components</h3>
            <div className="pf5-pills">
              {COMPONENTS.map(name => <span key={name}>{name}</span>)}
            </div>
            <h3>Rules</h3>
            <ul className="pf5-rules">
              <li>Every button and link is at least 44px tall.</li>
              <li>Motion stops when reduced motion is set.</li>
              <li>Text meets 4.5:1 contrast in both themes.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export function ContactSection() {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<number>()

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      // Clipboard blocked (e.g. insecure context): the address is still visible to copy by hand.
      return
    }
    setCopied(true)
    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <section id="contact" data-screen-label="Contact" className="pf5-section" style={{ paddingBottom: 'clamp(56px, 8vw, 96px)' }}>
      <div className="pf5-contact pf5-stage--clay">
        <div className="pf5-card pf5-contact__card">
          <h2>{contact.heading}</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, color: 'var(--ink-2)' }}>{contact.text}</p>

          <div className="pf5-copy">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <button type="button" className="pf5-btn pf5-btn--primary" style={{ minWidth: 96 }} onClick={copyEmail} aria-live="polite">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="pf5-links">
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
          </div>
          <p style={{ paddingTop: 16, borderTop: '1px solid var(--line)', fontSize: 14, color: 'var(--ink-3)' }}>
            {contact.footnote}
          </p>
        </div>
      </div>
    </section>
  )
}
