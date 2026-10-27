/**
 * PortfolioShell.tsx — The layout every page renders inside
 *
 * WHAT IT PROVIDES:
 *   - the .pf5 wrapper that portfolio-v5.css styles hang off, with the theme
 *     (data-theme) and reduced-motion (data-motion) attributes on it
 *   - the theme state, shared with the page through PortfolioThemeContext
 *   - skip link, optional announcement bar, sticky header, <main>, footer
 *
 * USAGE:
 *   <PortfolioShell>                 ← secondary pages (/pm, 404, ...)
 *   <PortfolioShell announcement>    ← homepage, with the dark bar on top
 *
 * Before this existed, the secondary pages used the old PageWrapper navbar,
 * which was built for the previous dark homepage and showed white links on
 * a cream page.
 */

import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Announcement, SiteFooter, SiteHeader } from './SiteChrome'
import { PortfolioThemeContext, usePortfolioTheme } from './usePortfolioTheme'
import '@styles/portfolio-v5.css'

// Same values as --bg in portfolio-v5.css. Painting <html> too means the
// area revealed by over-scrolling (rubber-banding) matches the page.
const PAGE_BACKGROUND = { light: '#f5f3ee', dark: '#11110f' }

interface PortfolioShellProps {
  children: ReactNode
  announcement?: boolean
}

export function PortfolioShell({ children, announcement = false }: PortfolioShellProps) {
  const themeState = usePortfolioTheme()
  const { theme, reduceMotion } = themeState

  useEffect(() => {
    document.documentElement.style.backgroundColor = PAGE_BACKGROUND[theme]
    document.documentElement.style.colorScheme = theme
  }, [theme])

  // Header links like "/#work" change the URL's #hash. After each navigation,
  // scroll to the element with that id (or to the top for a new page with no
  // hash). location.key changes on every navigation, so clicking the same
  // link twice still scrolls.
  const location = useLocation()
  useEffect(() => {
    const id = location.hash.slice(1)
    const target = id ? document.getElementById(id) : null
    if (target) {
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
    } else if (!id) {
      window.scrollTo({ top: 0 })
    }
  }, [location.key, location.hash, reduceMotion])

  return (
    <PortfolioThemeContext.Provider value={themeState}>
      <div className="pf5" data-theme={theme} data-motion={reduceMotion ? 'reduce' : 'full'}>
        <a href="#main" className="pf5-skip">Skip to content</a>
        {announcement && <Announcement />}
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </div>
    </PortfolioThemeContext.Provider>
  )
}
