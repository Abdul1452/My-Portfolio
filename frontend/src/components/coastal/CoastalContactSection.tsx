/**
 * CoastalContactSection.tsx — Contact CTA (section 06)
 *
 * Note: the source design's mailto address had a typo
 * ("abdullwasiuabdullah@gmail.com", double "l") that doesn't match the
 * real address — corrected here to abdulwasiuabdullah@gmail.com.
 */

import { useLanguage } from '@hooks/useLanguage'
import { coastalTranslations } from '@data/coastal-translations.data'

const EMAIL = 'abdulwasiuabdullah@gmail.com'

export function CoastalContactSection() {
  const { language } = useLanguage()
  const t = coastalTranslations[language]

  return (
    <section
      id="contact"
      data-screen-label="Contact"
      className="flex flex-wrap items-end justify-between gap-9 bg-coastal-green px-12 py-12 text-coastal-cream"
    >
      <div>
        <div className="mb-4 font-coastal-mono text-[11.5px] uppercase tracking-[.18em] text-coastal-cream/50">
          {t.sec6}
        </div>
        <h2 className="mb-3 max-w-[540px] text-balance font-coastal-display text-[34px] font-bold leading-[1.18] tracking-[-0.025em]">
          {t.contactH}
        </h2>
        <div className="font-coastal-mono text-[13.5px] text-coastal-sky">{EMAIL} · Turku, Finland</div>
      </div>
      <div className="flex min-w-[190px] flex-col gap-2 font-coastal-mono text-xs">
        <a
          href={`mailto:${EMAIL}`}
          className="rounded-md bg-coastal-sky py-3 text-center font-semibold text-coastal-green transition-colors hover:bg-coastal-sky-hover"
        >
          {t.send}
        </a>
        <a
          href="#cv"
          className="rounded-md border border-coastal-cream/25 py-3 text-center text-coastal-cream transition-colors hover:border-coastal-sky hover:text-coastal-sky"
        >
          {t.cv}
        </a>
      </div>
    </section>
  )
}
