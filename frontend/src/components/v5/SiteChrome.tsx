/**
 * SiteChrome.tsx — The frame around the page: announcement bar, header, footer
 *
 * These three are grouped because they're the parts that appear on every
 * screen of the design and none of them have state of their own — the
 * theme toggle's state lives in usePortfolioTheme, passed in as props.
 */

import { announcement, profile } from '@data/portfolio.data'

const NAV_LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#approach', label: 'How I work' },
]

export function Announcement() {
  return (
    <div role="region" aria-label="Announcement" className="pf5-announce">
      <div className="pf5-announce__inner">
        <span>{announcement.text}</span>
        <a href={announcement.linkUrl} target="_blank" rel="noreferrer">
          {announcement.linkLabel}
        </a>
      </div>
    </div>
  )
}

interface SiteHeaderProps {
  isDark: boolean
  onToggleTheme: () => void
}

export function SiteHeader({ isDark, onToggleTheme }: SiteHeaderProps) {
  return (
    <header className="pf5-header">
      <div className="pf5-header__inner">
        <a href="#main" className="pf5-brand">
          <span aria-hidden="true" className="pf5-brand__mark">{profile.monogram}</span>
          {profile.name}
        </a>

        <nav aria-label="Sections" className="pf5-nav">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>

        <div className="pf5-header__actions">
          <button
            type="button"
            className="pf5-iconbtn"
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            aria-pressed={isDark}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
            </svg>
          </button>
          <a href="#contact" className="pf5-btn pf5-btn--primary">Get in touch</a>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="pf5-footer">
      <div className="pf5-footer__inner">
        <span>© {new Date().getFullYear()} {profile.name} · Turku</span>
        <nav aria-label="Footer">
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
          <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </footer>
  )
}
