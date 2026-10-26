/**
 * CoastalCertificatesSection.tsx — CV + Certificates Grid (section 05)
 *
 * The sidebar's "Download CV" button (CoastalSidebar) links to #cv, which
 * lands here — this is the CV's home on the page, not a real PDF download
 * yet (see CoastalImagePlaceholder's doc comment: no upload backend
 * exists). Same placeholder treatment for certificate images.
 */

import { useLanguage } from '@hooks/useLanguage'
import { coastalTranslations } from '@data/coastal-translations.data'
import { ScrollReveal } from '@ui'
import { CoastalImagePlaceholder } from './CoastalImagePlaceholder'

export function CoastalCertificatesSection() {
  const { language } = useLanguage()
  const t = coastalTranslations[language]

  return (
    <section
      id="certificates"
      data-screen-label="Certificates"
      className="border-b border-coastal-green/[0.13] px-12 py-11"
    >
      <ScrollReveal>
        <div className="mb-6 flex items-center gap-4">
          <span className="font-coastal-mono text-[11.5px] uppercase tracking-[.18em] text-coastal-green/55">
            {t.sec5}
          </span>
          <span className="h-px flex-1 bg-coastal-green/[0.13]" />
          <span className="font-coastal-mono text-[11px] text-coastal-ink/42">{t.certsNote}</span>
        </div>
        <div className="grid grid-cols-4 gap-3.5">
          <div id="cv" className="scroll-mt-6 rounded-xl bg-coastal-green p-4 text-coastal-cream">
            <div className="mb-[13px] h-[110px]">
              <CoastalImagePlaceholder
                caption="CV preview"
                className="border-coastal-cream/25 bg-coastal-cream/[0.06] text-coastal-cream/50"
              />
            </div>
            <div className="mb-1 text-sm font-semibold">CV — Abdulwasiu.pdf</div>
            <div className="mb-3 font-coastal-mono text-[11px] text-coastal-cream/60">EN · updated regularly</div>
            <a
              href="#cv"
              className="block rounded-md bg-coastal-sky py-[9px] text-center font-coastal-mono text-[11.5px] font-semibold text-coastal-green transition-colors hover:bg-coastal-sky-hover"
            >
              {t.cvView}
            </a>
          </div>
          <div className="rounded-xl border border-coastal-green/[0.13] bg-white p-4">
            <div className="mb-[13px] h-[110px]">
              <CoastalImagePlaceholder caption="Certificate" />
            </div>
            <div className="mb-1 text-sm font-semibold">Full Stack Open</div>
            <div className="font-coastal-mono text-[11px] text-coastal-ink/50">University of Helsinki</div>
          </div>
          <div className="rounded-xl border border-coastal-green/[0.13] bg-white p-4">
            <div className="mb-[13px] h-[110px]">
              <CoastalImagePlaceholder caption="Certificate" />
            </div>
            <div className="mb-1 text-sm font-semibold">Certificate slot</div>
            <div className="font-coastal-mono text-[11px] text-coastal-ink/50">AWS · Scrum · CompTIA</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-coastal-green/30 p-4 text-coastal-ink/40">
            <span className="text-[22px]">＋</span>
            <span className="text-center font-coastal-mono text-[11px] tracking-[.1em]">{t.addAdmin}</span>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
