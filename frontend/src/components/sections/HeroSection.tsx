/**
 * HeroSection.tsx — Landing Hero
 *
 * WHY IT DOESN'T USE <Section>:
 *   The hero needs full viewport height (100svh) and its own layout, unlike
 *   the uniform content sections. So it renders its own <section> element.
 *
 * DATA SOURCES (all static — no API needed for the hero):
 *   - siteMeta      → name, title, tagline, email
 *   - heroStats     → the stat cards (5+ years, 40+ projects...)
 *   - heroTechStack → the tech pills (React, TypeScript...)
 *
 * ATOMS REUSED:
 *   Badge (available-to-hire), Button (CTAs), StatCard, Pill.
 *   The section is pure ASSEMBLY — it holds no logic, just arranges atoms
 *   around data. That's the payoff of building the atoms first.
 *
 * THE HEADLINE:
 *   Split across three lines with different treatments (solid, accent, faded)
 *   — this is the page's "thesis", the most characteristic visual moment.
 */

import { Badge, Button, StatCard, Pill } from '@ui'
import { siteMeta, heroStats, heroTechStack } from '@data/meta.data'
import { scrollToSection } from '@utils/scrollTo'
import styles from './HeroSection.module.css'

export function HeroSection() {
  return (
    <section className={styles.hero} id="hero">
      {/* Decorative dot-grid background (pure CSS, see module) */}
      <div className={styles.dots} aria-hidden="true" />

      {/* Left accent bar */}
      <div className={styles.accentBar} aria-hidden="true" />

      <div className={styles.content}>
        {/* Availability badge with pulsing dot */}
        <Badge withDot className={styles.badge}>
          Available to hire
        </Badge>

        {/* The headline — the page's thesis, split across three lines */}
        <h1 className={styles.headline}>
          <span className={styles.line1}>Software</span>
          <span className={styles.line2}>Engineer &amp; PM</span>
          <span className={styles.line3}>Based in Finland</span>
        </h1>

        {/* Tagline from siteMeta */}
        <p className={styles.tagline}>{siteMeta.tagline}</p>

        {/* Call-to-action buttons */}
        <div className={styles.ctas}>
          <Button variant="primary" onClick={() => scrollToSection('projects')}>
            View My Work →
          </Button>
          <Button variant="outline" onClick={() => scrollToSection('contact')}>
            Get in Touch
          </Button>
        </div>

        {/* Stat cards row */}
        <div className={styles.stats}>
          {heroStats.map(stat => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>

        {/* Tech stack pills */}
        <div className={styles.pills}>
          {heroTechStack.map(tech => (
            <Pill key={tech} label={tech} />
          ))}
        </div>
      </div>
    </section>
  )
}
