/**
 * SkillsSection.tsx — Skill Categories with Animated Bars
 *
 * FIRST SECTION TO USE LIVE DATA:
 *   Unlike Hero/About (static data), Skills reads from useApp() — the context
 *   that loaded data from the API (or fell back to static data if offline).
 *   Either way, `skills` is a SkillCategory[] we can map over.
 *
 * NESTED MAPPING:
 *   Outer loop: categories → columns.
 *   Inner loop: each category's skills → SkillBar components.
 *   This "map inside a map" renders a grid of columns, each with its bars.
 *
 * LOADING STATE:
 *   While status === 'loading', we show a lightweight skeleton so the layout
 *   doesn't jump. Once ready, the real bars render (and animate on scroll).
 */

import { Section } from '@layout'
import { SectionLabel, SkillBar, ScrollReveal } from '@ui'
import { useApp } from '@hooks/useApp'
import styles from './SkillsSection.module.css'

export function SkillsSection() {
  const { skills, status } = useApp()

  return (
    <Section id="skills" background="dark">
      <ScrollReveal>
        <SectionLabel number="02" label="Skills & Expertise" />
        <h2 className={styles.title}>What I Bring to the Table</h2>
      </ScrollReveal>

      {status === 'loading' ? (
        // Simple skeleton placeholder while data loads
        <div className={styles.skeleton}>Loading skills…</div>
      ) : (
        <div className={styles.grid}>
          {skills.map(category => (
            <ScrollReveal key={category.id} className={styles.column}>
              <h3 className={styles.categoryTitle}>{category.name}</h3>
              {category.skills.map(skill => (
                <SkillBar
                  key={skill.id}
                  name={skill.name}
                  percentage={skill.percentage}
                />
              ))}
            </ScrollReveal>
          ))}
        </div>
      )}
    </Section>
  )
}
