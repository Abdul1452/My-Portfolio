/**
 * Navbar.tsx — Fixed Top Navigation
 *
 * SCROLL-AWARE BEHAVIOR:
 *   At the very top of the page (over the dark hero) the navbar is subtle.
 *   Once the user scrolls down, it gains a blurred backdrop + bottom border
 *   so links stay readable over lighter sections. We track this with a
 *   `scrolled` boolean toggled by a scroll listener.
 *
 * COMPOSITION:
 *   - Desktop: shows the nav links inline + a theme toggle.
 *   - Mobile: shows a hamburger button that opens the MobileMenu drawer.
 *   Both share the same `navLinks` list so they never diverge.
 *
 * useMobileMenu:
 *   The hook from Phase 5 manages the drawer's open/close state (plus body
 *   scroll lock and Escape-to-close). Navbar just calls toggle()/close().
 *
 * PERFORMANCE — passive scroll listener:
 *   We pass { passive: true } to addEventListener. This tells the browser
 *   we won't call preventDefault(), letting it optimize scrolling. Small
 *   detail, but good practice for scroll handlers.
 */

import { useEffect, useState } from 'react'
import { cn } from '@utils/cn'
import { scrollToSection, scrollToTop } from '@utils/scrollTo'
import { useMobileMenu } from '@hooks/useMobileMenu'
import { MobileMenu } from './MobileMenu'
import { navLinks } from './navLinks'
import styles from './Navbar.module.css'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const mobileMenu = useMobileMenu()

  // Toggle the `scrolled` state when the user scrolls past a threshold.
  useEffect(() => {
    const handleScroll = () => {
      // window.scrollY = how many pixels we've scrolled from the top.
      setScrolled(window.scrollY > 20)
    }

    // passive: true = we promise not to preventDefault, so the browser
    // can scroll smoothly without waiting on our handler.
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // run once on mount in case we load partway down

    // Cleanup: remove the listener when Navbar unmounts.
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Clicking the logo scrolls back to the top.
  const handleLogoClick = () => scrollToTop()

  // Clicking a link scrolls to that section (smooth).
  const handleLinkClick = (id: string) => scrollToSection(id)

  return (
    <>
      <nav className={cn(styles.navbar, scrolled && styles.scrolled)}>
        {/* Logo / monogram */}
        <button className={styles.logo} onClick={handleLogoClick} aria-label="Back to top">
          PORTFOLIO
        </button>

        {/* Desktop links */}
        <ul className={styles.links} role="list">
          {navLinks.map(link => (
            <li key={link.id}>
              <button className={styles.link} onClick={() => handleLinkClick(link.id)}>
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger button */}
        <button
          className={styles.hamburger}
          onClick={mobileMenu.toggle}
          aria-label="Open menu"
          aria-expanded={mobileMenu.isOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* The slide-in mobile drawer (rendered but hidden until open) */}
      <MobileMenu
        isOpen={mobileMenu.isOpen}
        onClose={mobileMenu.close}
        onNavigate={handleLinkClick}
      />
    </>
  )
}
