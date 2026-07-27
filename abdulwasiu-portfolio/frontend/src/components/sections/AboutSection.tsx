/**
 * AboutSection.tsx — Bio, Facts & Experience Timeline
 *
 * LAYOUT:
 *   Top: two columns — bio text (left) + fact-card grid (right).
 *   Below: a vertical experience timeline.
 *
 * DATA:
 *   - siteMeta     → name, title
 *   - aboutFacts   → the fact cards (Location, Languages, Open To...)
 *   - experience   → the timeline entries (from experience.data.ts)
 *
 * MAPPING PATTERN:
 *   {aboutFacts.map(fact => <FactCard ... />)}
 *   This is the core React pattern: transform an array of data into an array
 *   of components. The `key` prop (unique per item) lets React track each one
 *   efficiently across re-renders — always required when mapping.
 *
 * ScrollReveal + delay:
 *   Each column/entry reveals with a staggered delay for a cascade effect.
 */

import { Section } from '@layout'
import { SectionLabel, Divider, FactCard, Badge, ScrollReveal } from '@ui'
import { siteMeta, aboutFacts } from '@data/meta.data'
import { experience } from '@data/experience.data'
import styles from './AboutSection.module.css'

export function AboutSection() {
  return (
    <Section id="about" background="light">
      <ScrollReveal>
        <SectionLabel number="01" label="About" />
      </ScrollReveal>

      {/* ── Top: bio + facts ─────────────────────────────────────────────── */}
      <div className={styles.grid}>
        {/* Left column: name, role, bio */}
        <ScrollReveal className={styles.bioCol}>
          <h2 className={styles.name}>{siteMeta.name}</h2>
          <p className={styles.role}>{siteMeta.title}</p>
          <Divider variant="accent" className={styles.divider} />
          <p className={styles.bio}>
            Software Engineer with a dual focus on full-stack development and
            structured project delivery. Currently pursuing a degree in Project
            Management alongside my engineering practice.
          </p>
          <p className={styles.bio}>
            Based in {siteMeta.location}. I build production-grade applications
            and manage end-to-end project lifecycles using Agile and Waterfall
            methodologies. Open to roles in the Finnish &amp; Nordic tech market.
          </p>
        </ScrollReveal>

        {/* Right column: fact cards */}
        <ScrollReveal delay={2} className={styles.factsCol}>
          <div className={styles.facts}>
            {aboutFacts.map(fact => (
              <FactCard key={fact.key} factKey={fact.key} value={fact.value} />
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* ── Experience timeline ──────────────────────────────────────────── */}
      <ScrollReveal className={styles.timelineWrap}>
        <h3 className={styles.timelineHeading}>Experience</h3>
        <ol className={styles.timeline} role="list">
          {experience.map(item => (
            <li key={item.id} className={styles.timelineItem}>
              <div className={styles.timelineDot} aria-hidden="true" />
              <div className={styles.timelineContent}>
                <div className={styles.timelineHeader}>
                  <span className={styles.timelineRole}>{item.role}</span>
                  <span className={styles.timelineDate}>
                    {item.startDate} – {item.endDate}
                  </span>
                </div>
                <div className={styles.timelineCompany}>
                  {item.company} · {item.location}
                </div>
                <ul className={styles.bullets}>
                  {item.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
                <div className={styles.tags}>
                  {item.tags.map(tag => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </ScrollReveal>
    </Section>
  )
}
