/**
 * CoastalProjectsSection.tsx — Flagship + Secondary Project Cards (section 02)
 *
 * Reads `projects` from useApp() (API-first, static-fallback — see
 * AppContext) instead of hardcoding project content, so this section stays
 * correct if projects are edited in the database later. The flagship card
 * is whichever project has `featured: true`; the rest render as the
 * smaller two-up cards, in `order`.
 */

import { useApp } from '@hooks/useApp'
import { useLanguage } from '@hooks/useLanguage'
import { coastalTranslations } from '@data/coastal-translations.data'
import { ScrollReveal } from '@ui'
import { CoastalImagePlaceholder } from './CoastalImagePlaceholder'

// Delivery-timeline snapshot for the flagship project. Not backed by a
// Prisma field (Project has no per-milestone progress model) — this is
// presentational, matching the source design's own hardcoded snapshot.
const FLAGSHIP_TIMELINE = [
  { label: 'Governance', pct: 100, tone: 'strong' as const },
  { label: 'EDA + model', pct: 58, tone: 'accent' as const },
  { label: 'API + Kafka', pct: 14, tone: 'faint' as const },
]

const FILTER_TABS = ['All', 'Software', 'Security', 'PM', 'Coursework']

export function CoastalProjectsSection() {
  const { projects } = useApp()
  const { language } = useLanguage()
  const t = coastalTranslations[language]

  const engineering = projects
    .filter(p => p.category === 'engineering')
    .sort((a, b) => a.order - b.order)
  const flagship = engineering.find(p => p.featured) ?? engineering[0]
  const secondary = engineering.filter(p => p.id !== flagship?.id)

  return (
    <section
      id="projects"
      data-screen-label="Projects"
      className="border-b border-coastal-green/[0.13] px-12 py-11"
    >
      <ScrollReveal>
        <div className="mb-[22px] flex flex-wrap items-center justify-between gap-4">
          <div className="font-coastal-mono text-[11.5px] uppercase tracking-[.18em] text-coastal-green/55">
            {t.sec2}
          </div>
          <div className="flex flex-wrap gap-1.5 font-coastal-mono text-[11.5px]">
            {FILTER_TABS.map((tab, i) => (
              <span
                key={tab}
                className={
                  i === 0
                    ? 'rounded-full bg-coastal-green px-3 py-1.5 text-coastal-cream'
                    : 'rounded-full border border-coastal-green/[0.22] px-3 py-1.5 text-coastal-ink/60'
                }
              >
                {tab}
              </span>
            ))}
          </div>
        </div>

        {flagship && (
          <div className="mb-3.5 overflow-hidden rounded-xl border border-coastal-green/[0.13] bg-white">
            <div className="grid grid-cols-[1.25fr_1fr]">
              <div className="px-[30px] pb-7 pt-[30px]">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h3 className="font-coastal-display text-[27px] font-bold tracking-[-0.022em]" translate="no">
                    {flagship.title}
                  </h3>
                  <span className="rounded bg-coastal-sky px-2 py-1 font-coastal-mono text-[10px] font-semibold tracking-[.1em] text-coastal-green">
                    FLAGSHIP
                  </span>
                  <span className="rounded bg-coastal-green/[0.09] px-2 py-1 font-coastal-mono text-[10px] tracking-[.1em] text-coastal-green">
                    SPRINT 1 / 6
                  </span>
                </div>
                <p className="mb-4 text-pretty text-[15px] leading-[1.7] text-coastal-ink/68">
                  {flagship.description}
                </p>

                <div className="mb-2 font-coastal-mono text-[11.5px] tracking-[.06em] text-coastal-ink/50">
                  {t.timeline}
                </div>
                <div className="mb-5 flex flex-col gap-1.5">
                  {FLAGSHIP_TIMELINE.map(row => (
                    <div key={row.label} className="flex items-center gap-2.5">
                      <span className="w-[86px] font-coastal-mono text-[10.5px] text-coastal-ink/55">
                        {row.label}
                      </span>
                      <span className="h-2 flex-1 overflow-hidden rounded bg-coastal-green/[0.08]">
                        <span
                          className={
                            'block h-full animate-growBar rounded ' +
                            (row.tone === 'strong'
                              ? 'bg-coastal-green'
                              : row.tone === 'accent'
                                ? 'bg-coastal-sky'
                                : 'bg-coastal-green/30')
                          }
                          style={{ width: `${row.pct}%` }}
                        />
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mb-[22px] flex flex-wrap gap-1.5">
                  {flagship.tag.split(' · ').map(tech => (
                    <span
                      key={tech}
                      className="rounded-md border border-coastal-green/[0.12] bg-coastal-cream px-[9px] py-1 font-coastal-mono text-[11.5px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 font-coastal-mono text-xs">
                  <a
                    href="#projects"
                    className="rounded-md bg-coastal-green px-4 py-2.5 text-coastal-cream transition-colors hover:bg-coastal-green-dark"
                  >
                    {t.caseStudy}
                  </a>
                  {flagship.linkUrl && (
                    <a
                      href={flagship.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-coastal-green/25 px-4 py-2.5 text-coastal-green transition-colors hover:border-coastal-green"
                    >
                      {t.repoBtn}
                    </a>
                  )}
                </div>
              </div>
              <div className="relative min-h-[340px] border-l border-coastal-green/10">
                <CoastalImagePlaceholder caption="Project screenshot" shape="rect" className="absolute inset-0" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3.5">
          {secondary.map(project => (
            <div key={project.id} className="rounded-xl border border-coastal-green/[0.13] bg-white p-6">
              <div className="mb-[18px] h-[130px]">
                <CoastalImagePlaceholder caption="Screenshot" />
              </div>
              <h3 className="mb-2.5 font-coastal-display text-xl font-semibold tracking-[-0.015em]">
                {project.title}
              </h3>
              <p className="mb-[18px] text-pretty text-[14.5px] leading-[1.7] text-coastal-ink/66">
                {project.description}
              </p>
              <div className="mb-[18px] flex flex-wrap gap-1.5">
                {project.tag.split(' · ').map(tech => (
                  <span
                    key={tech}
                    className="rounded-md border border-coastal-green/[0.12] bg-coastal-cream px-2 py-1 font-coastal-mono text-[11px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              {project.linkUrl && (
                <a
                  href={project.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-coastal-leaf pb-0.5 font-coastal-mono text-xs text-coastal-leaf"
                >
                  {t.caseStudy}
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3.5 flex items-center justify-between gap-5 rounded-xl border border-dashed border-coastal-green/30 px-[26px] py-[22px] font-coastal-mono text-[12.5px] text-coastal-ink/55">
          <span>
            <span className="font-semibold text-coastal-green">Open slot.</span> {t.openSlot}
          </span>
          <span className="text-[22px] text-coastal-green/35">＋</span>
        </div>
      </ScrollReveal>
    </section>
  )
}
