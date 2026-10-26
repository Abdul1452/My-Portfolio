/**
 * MobileMenu.tsx — Slide-In Mobile Navigation Drawer
 *
 * CONTROLLED COMPONENT:
 *   This component does NOT own its open/close state. The parent (Navbar)
 *   owns it via useMobileMenu and passes `isOpen` down, plus callbacks
 *   (onClose, onNavigate). The child just renders based on props and reports
 *   events up. This "lift state up" pattern keeps a single source of truth.
 *
 * WHY RENDER IT EVEN WHEN CLOSED?
 *   We keep it in the DOM and toggle an `.open` class rather than removing it.
 *   This lets CSS animate the slide-in/out transition. If we unmounted it,
 *   there'd be nothing to animate out.
 *
 * ACCESSIBILITY:
 *   - The backdrop is a button so it's keyboard-focusable and closes on click.
 *   - aria-hidden mirrors the open state so screen readers skip it when closed.
 */

import { cn } from '@utils/cn'
import { navLinks } from './navLinks'
import { siteMeta } from '@data/meta.data'
import styles from './MobileMenu.module.css'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (id: string) => void
}

export function MobileMenu({ isOpen, onClose, onNavigate }: MobileMenuProps) {
  // When a link is tapped: scroll to the section AND close the drawer.
  const handleClick = (id: string) => {
    onNavigate(id)
    onClose()
  }

  return (
    <>
      {/* Dimmed backdrop — tapping it closes the menu */}
      <button
        className={cn(styles.backdrop, isOpen && styles.backdropOpen)}
        onClick={onClose}
        aria-label="Close menu"
        tabIndex={isOpen ? 0 : -1}
      />

      {/* The drawer panel */}
      <aside
        className={cn(styles.drawer, isOpen && styles.drawerOpen)}
        aria-hidden={!isOpen}
      >
        <nav className={styles.nav}>
          {navLinks.map(link => (
            <button
              key={link.id}
              className={styles.link}
              onClick={() => handleClick(link.id)}
              tabIndex={isOpen ? 0 : -1}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Footer of the drawer: quick contact */}
        <div className={styles.drawerFooter}>
          <a href={`mailto:${siteMeta.email}`} className={styles.email}>
            {siteMeta.email}
          </a>
        </div>
      </aside>
    </>
  )
}
