/**
 * CoastalSkillsSection.tsx — Skill-to-Project Grid (section 04)
 *
 * Deliberately NOT the existing percentage-bar Skill/SkillCategory model
 * (SkillsSection/SkillBar elsewhere in this app) — this design's skills
 * grid is a different shape entirely: a tech-stack line pointing at the
 * project it was used on, no percentages. Three of the six rows link to
 * real Project records (via useApp, so the link stays correct if a
 * project's repo URL changes); the other three point at real repos that
 * aren't Project records (this site's own repo, the Full Stack Open
 * coursework repo) so they're plain static links.
 */

import { useApp } from '@hooks/useApp'
import { useLanguage } from '@hooks/useLanguage'
import { coastalTranslations } from '@data/coastal-translations.data'
import { ScrollReveal } from '@ui'

const STATIC_LINKS = {
  portfolioApi: 'https://github.com/Abdul1452/My-Portfolio',
  fullStackOpen: 'https://github.com/Abdul1452/FULLSTACK-OPEN',
}

export function CoastalSkillsSection() {
  const { projects } = useApp()
  const { language } = useLanguage()
  const t = coastalTranslations[language]

  const findUrl = (slug: string) => projects.find(p => p.slug === slug)?.linkUrl ?? null

  const rows = [
    { stack: 'Python · FastAPI · scikit-learn', label: 'Petosvahti →', url: findUrl('petosvahti'), noTranslate: true },
    { stack: 'TypeScript · React · Next.js', label: 'Slope Calc →', url: findUrl('slope-deflection-calculator') },
    { stack: 'AWS Lambda · SAM · IaC', label: 'Quote API →', url: findUrl('serverless-quote-api') },
    { stack: 'Kafka · event streaming', label: 'Petosvahti →', url: findUrl('petosvahti'), noTranslate: true },
    { stack: 'Node · Express · PostgreSQL', label: 'Portfolio API →', url: STATIC_LINKS.portfolioApi },
    { stack: 'Docker · GitHub Actions CI', label: 'Full Stack Open →', url: STATIC_LINKS.fullStackOpen },
  ]

  return (
    <section
      id="skills"
      data-screen-label="Skills"
      className="border-b border-coastal-green/[0.13] px-12 py-11"
    >
      <ScrollReveal>
        <div className="mb-2 font-coastal-mono text-[11.5px] uppercase tracking-[.18em] text-coastal-green/55">
          {t.sec4}
        </div>
        <p className="mb-6 max-w-[600px] text-[14.5px] text-coastal-ink/58">{t.skillsSub}</p>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-coastal-green/[0.14] bg-coastal-green/[0.14]">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 bg-white px-[22px] py-5"
            >
              <span className="text-[15px] font-medium">{row.stack}</span>
              {row.url && (
                <a
                  href={row.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  translate={row.noTranslate ? 'no' : undefined}
                  className="whitespace-nowrap font-coastal-mono text-[11.5px]"
                >
                  {row.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  )
}
