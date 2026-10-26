/**
 * Footer.tsx — Site Footer
 *
 * CENTRALIZED DATA:
 *   Social links and the name come from siteMeta (data/meta.data.ts), not
 *   hardcoded here. Update your LinkedIn once in meta.data.ts (or its env
 *   var) and it changes everywhere, including this footer.
 *
 * WHAT'S INSIDE:
 *   - A short sign-off line
 *   - Social links (LinkedIn, GitHub, Twitter) opening safely in new tabs
 *   - A "back to top" button using the scrollToTop util
 *   - The copyright line with the current year (computed, never stale)
 */

import { siteMeta } from '@data/meta.data'
import { scrollToTop } from '@utils/scrollTo'
import styles from './Footer.module.css'

export function Footer() {
  // Compute the year at render time so it's never out of date.
  const year = new Date().getFullYear()

  const socials = [
    { label: 'LinkedIn', url: siteMeta.socials.linkedin },
    { label: 'GitHub', url: siteMeta.socials.github },
    { label: 'Twitter / X', url: siteMeta.socials.twitter },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Social links */}
        <div className={styles.socials}>
          {socials.map(social => (
            <a
              key={social.label}
              href={social.url}
              className={styles.social}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.label}
            </a>
          ))}
        </div>

        {/* Back to top */}
        <button className={styles.backToTop} onClick={scrollToTop}>
          Back to top ↑
        </button>
      </div>

      {/* Bottom line */}
      <div className={styles.bottom}>
        <span className={styles.copy}>
          © {year} {siteMeta.name} · {siteMeta.location}
        </span>
        <span className={styles.copy}>Designed &amp; built in Finland</span>
      </div>
    </footer>
  )
}
