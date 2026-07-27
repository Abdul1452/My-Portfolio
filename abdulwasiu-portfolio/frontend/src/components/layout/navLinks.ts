/**
 * navLinks.ts — Shared Navigation Links
 *
 * WHY A SHARED FILE?
 *   Both Navbar (desktop) and MobileMenu use the SAME set of links.
 *   Defining them once here means adding a new section link updates BOTH
 *   automatically — they can never drift out of sync.
 *
 * Each link points to a section id on the home page (e.g. "#about" scrolls
 * to <Section id="about">). The `id` (without #) is used by scrollToSection.
 */

export interface NavLink {
  id: string      // section id, e.g. "about"
  label: string   // display text, e.g. "About"
}

export const navLinks: NavLink[] = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Work' },
  { id: 'pm-projects', label: 'PM' },
  { id: 'contact', label: 'Contact' },
]
