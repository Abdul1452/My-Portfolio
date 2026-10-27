/**
 * SiteChrome.tsx — The frame around every page: announcement bar, header, footer
 *
 * Used by PortfolioShell on every route (home, /pm, /projects/:slug, 404),
 * so the whole site shares one header, one footer and one theme toggle.
 *
 * WHY <Link to="/#work"> INSTEAD OF <a href="#work">?
 *   A bare "#work" only works on the homepage — on /pm there is no #work
 *   section to scroll to. "/#work" means "the homepage, at the Work section",
 *   so it works from anywhere. <Link> navigates inside the React app without
 *   a full page reload; PortfolioV5Page then scrolls to the section named in
 *   the URL's #hash.
 */

import { Link } from 'react-router-dom'
import { announcement, profile } from '@data/portfolio.data'
import { usePortfolioThemeContext } from './usePortfolioTheme'

const NAV_LINKS = [
  { to: '/#work', label: 'Work' },
  { to: '/#skills', label: 'Skills' },
  { to: '/#experience', label: 'Experience' },
  { to: '/pm', label: 'Guidebook' },
  { to: '/#approach', label: 'How I work' },
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

export function SiteHeader() {
  const { theme, toggleTheme } = usePortfolioThemeContext()

  return (
    <header className="pf5-header">
      <div className="pf5-header__inner">
        <Link to="/" className="pf5-brand">
          <span aria-hidden="true" className="pf5-brand__mark">{profile.monogram}</span>
          {profile.name}
        </Link>

        <nav aria-label="Sections" className="pf5-nav">
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
        </nav>

        <div className="pf5-header__actions">
          <button
            type="button"
            className="pf5-iconbtn"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            aria-pressed={theme === 'dark'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
            </svg>
          </button>
          <Link to="/#contact" className="pf5-btn pf5-btn--primary">Get in touch</Link>
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
          <Link to="/#work">Work</Link>
          <Link to="/pm">Guidebook</Link>
          <Link to="/#contact">Contact</Link>
          <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </footer>
  )
}
