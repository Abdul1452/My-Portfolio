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
 *   a full page reload; PortfolioShell then scrolls to the section named in
 *   the URL's #hash.
 *
 * v6 ADDITIONS:
 *   - an icon next to every nav label (the same icon as that section's eyebrow)
 *   - "you are here": the section in view gets aria-current="location"
 *   - below 860px the links move into a sheet opened from a menu button,
 *     instead of disappearing (v5 hid them with no replacement)
 *   - the header stays sticky (position: sticky in the CSS) on every size
 */

import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mail, Menu, Moon, Sparkles, Sun, X, type LucideIcon } from 'lucide-react'
import { announcement, profile } from '@data/portfolio.data'
import { usePortfolioThemeContext } from './usePortfolioTheme'
import { GUIDEBOOK_ICON, IconTile, SECTION_META } from './ui'

interface NavLink { to: string; label: string; icon: LucideIcon; sectionId?: string }

const NAV_LINKS: NavLink[] = [
  { to: '/#work', label: 'Work', icon: SECTION_META.work.icon, sectionId: 'work' },
  { to: '/#skills', label: 'Skills', icon: SECTION_META.skills.icon, sectionId: 'skills' },
  { to: '/#experience', label: 'Experience', icon: SECTION_META.experience.icon, sectionId: 'experience' },
  { to: '/pm', label: 'Guidebook', icon: GUIDEBOOK_ICON },
  { to: '/#approach', label: 'How I work', icon: SECTION_META.approach.icon, sectionId: 'approach' },
]

const SPY_IDS = NAV_LINKS.flatMap(link => (link.sectionId ? [link.sectionId] : []))

/**
 * Which nav section is in the middle of the viewport (homepage only).
 * The observer watches a thin band across the middle of the screen; the
 * first section crossing it wins. Nothing in the band (hero, footer) → null.
 */
function useCurrentSection(enabled: boolean) {
  const [current, setCurrent] = useState<string | null>(null)

  useEffect(() => {
    setCurrent(null)
    if (!enabled) return
    const inBand = new Set<string>()
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) inBand.add(entry.target.id)
        else inBand.delete(entry.target.id)
      }
      setCurrent(SPY_IDS.find(id => inBand.has(id)) ?? null)
    }, { rootMargin: '-45% 0px -50% 0px' })
    for (const id of SPY_IDS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [enabled])

  return current
}

function useNavState() {
  const { pathname } = useLocation()
  const currentSection = useCurrentSection(pathname === '/')
  return (link: NavLink): 'location' | 'page' | undefined => {
    if (link.sectionId) return link.sectionId === currentSection ? 'location' : undefined
    return pathname === link.to ? 'page' : undefined
  }
}

export function Announcement() {
  return (
    <div role="region" aria-label="Announcement" className="pf5-announce">
      <div className="pf5-announce__inner">
        <span className="pf6-iconrow">
          <Sparkles size={14} aria-hidden="true" />
          {announcement.text}
        </span>
        <a href={announcement.linkUrl} target="_blank" rel="noreferrer">
          {announcement.linkLabel}
        </a>
      </div>
    </div>
  )
}

// ─── Mobile menu sheet ────────────────────────────────────────────────────────

function MenuSheet({ onClose, currentOf }: { onClose: () => void; currentOf: (link: NavLink) => 'location' | 'page' | undefined }) {
  const { theme, toggleTheme } = usePortfolioThemeContext()
  const panelRef = useRef<HTMLDivElement>(null)

  // Same rules as the guidebook dialog: focus in, Esc out, page frozen.
  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>('nav a[href]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  function trapFocus(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab' || !panelRef.current) return
    const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const setTheme = (next: 'dark' | 'light') => {
    if (next !== theme) toggleTheme()
  }

  return (
    <div className="pf6-sheet" onClick={onClose}>
      <div
        ref={panelRef}
        id="pf6-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="pf6-sheet__panel"
        onClick={e => e.stopPropagation()}
        onKeyDown={trapFocus}
      >
        <div className="pf6-sheet__top">
          <Link to="/" className="pf5-brand" onClick={onClose}>
            <span aria-hidden="true" className="pf5-brand__mark">{profile.monogram}</span>
            {profile.name}
          </Link>
          <button type="button" className="pf5-iconbtn" aria-label="Close menu" onClick={onClose}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Sections" className="pf6-sheet__nav">
          {NAV_LINKS.map(link => {
            const current = currentOf(link)
            return (
              <Link key={link.to} to={link.to} aria-current={current} onClick={onClose}>
                <IconTile icon={link.icon} tone={current ? 'accent' : 'neutral'} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="pf6-sheet__foot">
          <div className="pf6-sheet__theme">
            <span id="pf6-theme-label">Theme</span>
            <div role="group" aria-labelledby="pf6-theme-label" className="pf6-segmented">
              <button type="button" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}>
                <Moon size={14} aria-hidden="true" /> Dark
              </button>
              <button type="button" aria-pressed={theme === 'light'} onClick={() => setTheme('light')}>
                <Sun size={14} aria-hidden="true" /> Light
              </button>
            </div>
          </div>
          <Link to="/#contact" className="pf5-btn pf5-btn--primary pf5-btn--lg" onClick={onClose}>
            <Mail size={18} aria-hidden="true" /> Get in touch
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function SiteHeader() {
  const { theme, toggleTheme } = usePortfolioThemeContext()
  const currentOf = useNavState()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // Closing returns focus to the button that opened the menu.
  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }, [])

  // The sheet renders next to the header, not inside it: the header's
  // backdrop-filter would make a fixed-position child size itself to the
  // header instead of the viewport.
  return (
    <>
    <header className="pf5-header">
      <div className="pf5-header__inner">
        <Link to="/" className="pf5-brand">
          <span aria-hidden="true" className="pf5-brand__mark">{profile.monogram}</span>
          {profile.name}
        </Link>

        <nav aria-label="Sections" className="pf5-nav">
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to} aria-current={currentOf(link)}>
              <link.icon size={16} aria-hidden="true" />
              {link.label}
            </Link>
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
            {theme === 'dark' ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
          </button>
          <Link to="/#contact" className="pf5-btn pf5-btn--primary pf6-header-cta">
            <Mail size={18} aria-hidden="true" /> Get in touch
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            className="pf5-iconbtn pf6-menubtn"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="pf6-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
    {menuOpen && <MenuSheet onClose={closeMenu} currentOf={currentOf} />}
    </>
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
