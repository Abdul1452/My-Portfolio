/**
 * CoastalOverviewSection.tsx — Hero + Stat Cards (section 01)
 */

import { useLanguage } from '@hooks/useLanguage'
import { coastalTranslations } from '@data/coastal-translations.data'
import { ScrollReveal } from '@ui'

const stats: Array<{ value: string; label: string }> = [
  { value: '12', label: 'statRepos' },
  { value: '6', label: 'statSprints' },
  { value: 'CI/CD', label: 'statCI' },
]

export function CoastalOverviewSection() {
  const { language } = useLanguage()
  const t = coastalTranslations[language]

  return (
    <section
      id="overview"
      data-screen-label="Overview"
      className="border-b border-coastal-green/[0.13] px-12 pb-11 pt-[52px]"
    >
      <ScrollReveal>
        <div className="mb-[18px] font-coastal-mono text-[11.5px] uppercase tracking-[.18em] text-coastal-green/55">
          {t.sec1}
        </div>
        <h1 className="mb-5 max-w-[800px] text-balance font-coastal-display text-[50px] font-bold leading-[1.06] tracking-[-0.03em]">
          {t.heroA}{' '}
          <span
            className="text-coastal-leaf"
            style={{ backgroundImage: 'linear-gradient(transparent 68%, rgba(148,217,221,.55) 68%)' }}
          >
            {t.heroAccent}
          </span>{' '}
          {t.heroB}
        </h1>
        <p className="mb-[34px] max-w-[680px] text-pretty text-[16.5px] leading-[1.75] text-coastal-ink/68">
          {t.heroIntro}
        </p>
        <div className="grid grid-cols-4 gap-3">
          {stats.map(stat => (
            <div key={stat.label} className="rounded-[10px] border border-coastal-green/[0.13] bg-white p-[18px]">
              <div className="font-coastal-display text-[27px] font-bold tabular-nums tracking-[-0.02em]">
                {stat.value}
              </div>
              <div className="mt-[5px] font-coastal-mono text-[11px] tracking-[.08em] text-coastal-ink/50">
                {t[stat.label as keyof typeof t]}
              </div>
            </div>
          ))}
          <div className="rounded-[10px] border border-coastal-green/[0.13] bg-white p-[18px]">
            <div className="font-coastal-display text-[27px] font-bold tracking-[-0.02em]">EU</div>
            <div className="mt-[5px] font-coastal-mono text-[11px] tracking-[.08em] text-coastal-ink/50">
              GDPR · AI ACT · PSD3
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
