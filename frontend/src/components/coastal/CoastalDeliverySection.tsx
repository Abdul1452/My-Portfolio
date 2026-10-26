/**
 * CoastalDeliverySection.tsx — Delivery & PM Practices (section 03)
 *
 * The guidebook CTA links straight to the existing /pm route
 * (PMGuidebookPage) — that page already exists and works, so this points
 * there directly rather than through PMProject.linkUrl (which is null in
 * the seed data since the guidebook isn't an external link).
 */

import { Link } from 'react-router-dom'
import { useLanguage } from '@hooks/useLanguage'
import { coastalTranslations } from '@data/coastal-translations.data'
import { ScrollReveal } from '@ui'

const PRACTICES = [
  {
    label: 'GOVERNANCE',
    body: 'Project charter, business case and a live risk register before the first commit. Decisions land in numbered ADRs so the reasoning survives.',
  },
  {
    label: 'CADENCE',
    body: 'Petosvahti runs on six two-week sprints with a public backlog and a ways-of-working doc. Progress is visible without a status meeting.',
  },
  {
    label: 'COMPLIANCE',
    body: 'GDPR, the EU AI Act and PSD2/PSD3 mapped to concrete requirements. Accessibility to WCAG 2.2 AA, not as an afterthought.',
  },
]

export function CoastalDeliverySection() {
  const { language } = useLanguage()
  const t = coastalTranslations[language]

  return (
    <section
      id="delivery"
      data-screen-label="Delivery and PM"
      className="border-b border-coastal-green/[0.13] bg-coastal-sand px-12 py-11"
    >
      <ScrollReveal>
        <div className="mb-6 font-coastal-mono text-[11.5px] uppercase tracking-[.18em] text-coastal-green/55">
          {t.sec3}
        </div>
        <div className="mb-4 grid grid-cols-3 gap-3.5">
          {PRACTICES.map(practice => (
            <div key={practice.label} className="rounded-xl border border-coastal-green/[0.13] bg-white p-6">
              <div className="mb-3 font-coastal-mono text-[11px] tracking-[.14em] text-coastal-leaf">
                {practice.label}
              </div>
              <p className="text-[14.5px] leading-[1.7] text-coastal-ink/66">{practice.body}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl bg-coastal-green px-7 py-[26px] text-coastal-cream">
          <div>
            <div className="mb-[5px] font-coastal-display text-[19px] font-semibold">PM Guidebook</div>
            <div className="font-coastal-mono text-xs text-coastal-cream/60">
              Agile, Waterfall, risk registers and Finnish working culture — the reference I actually use.
            </div>
          </div>
          <Link
            to="/pm"
            className="whitespace-nowrap rounded-md bg-coastal-sky px-[18px] py-[11px] font-coastal-mono text-xs font-semibold text-coastal-green transition-colors hover:bg-coastal-sky-hover"
          >
            {t.guidebook}
          </Link>
        </div>
      </ScrollReveal>
    </section>
  )
}
