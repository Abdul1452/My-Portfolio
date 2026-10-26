/**
 * CoastalSidebar.tsx — Fixed Left Rail (nav, profile, language, links)
 *
 * This IS the site nav for CoastalHomePage — there's no separate top
 * Navbar here (see pages/CoastalHomePage.tsx, which renders standalone
 * outside <PageWrapper> for exactly this reason). Active-link highlight
 * comes from useActiveSection's scroll-spy, not a hardcoded "first item".
 */

import { cn } from '@utils/cn'
import { useLanguage } from '@hooks/useLanguage'
import { useActiveSection } from '@hooks/useActiveSection'
import { coastalTranslations } from '@data/coastal-translations.data'
import { CoastalImagePlaceholder } from './CoastalImagePlaceholder'

const GITHUB_URL = 'https://github.com/Abdul1452'
const LINKEDIN_URL = 'https://www.linkedin.com/in/abdullahi-abdulwasiu-82114a234'

const SECTIONS = [
  { id: 'overview', num: '01' },
  { id: 'projects', num: '02' },
  { id: 'delivery', num: '03' },
  { id: 'skills', num: '04' },
  { id: 'certificates', num: '05' },
  { id: 'contact', num: '06' },
] as const

export function CoastalSidebar() {
  const { language, setLanguage } = useLanguage()
  const t = coastalTranslations[language]
  const activeId = useActiveSection(SECTIONS.map(s => s.id))

  const navLabels: Record<(typeof SECTIONS)[number]['id'], string> = {
    overview: t.nav1,
    projects: t.nav2,
    delivery: t.nav3,
    skills: t.nav4,
    certificates: t.nav5,
    contact: t.nav6,
  }

  return (
    <aside className="sticky top-0 flex h-screen w-[300px] flex-none flex-col gap-6 overflow-y-auto bg-coastal-green px-[26px] py-[30px] text-coastal-cream">
      {/* Profile */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          <div className="h-[150px] w-[150px]">
            <CoastalImagePlaceholder
              shape="circle"
              caption="Profile photo"
              className="border-coastal-cream/25 bg-coastal-cream/[0.06] text-coastal-cream/50"
            />
          </div>
        </div>
        <div>
          <div className="font-coastal-display text-xl font-bold leading-[1.22] tracking-[-0.02em]" translate="no">
            Abdulwasiu
            <br />
            Abdullahi Olamilekan
          </div>
          <div className="mt-2 font-coastal-mono text-[11.5px] leading-[1.7] text-coastal-cream/60">
            Software &amp; Cybersecurity Eng.
            <br />
            Project Management
            <br />
            Turku UAS · 3rd year
          </div>
        </div>
        <div className="inline-flex w-fit items-center gap-2 self-start rounded-full border border-coastal-sky/35 bg-coastal-sky/[0.12] px-3 py-[7px] font-coastal-mono text-[11px] uppercase tracking-[.1em] text-coastal-sky">
          <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-coastal-sky" />
          Kesätyö 2027
        </div>
      </div>

      {/* Nav */}
      <nav aria-label="Sections" className="flex flex-col gap-0.5 font-coastal-mono text-[12.5px]">
        {SECTIONS.map(section => {
          const isActive = activeId === section.id
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-[11px] py-[9px] transition-colors',
                isActive
                  ? 'bg-coastal-sky/[0.14] text-coastal-sky'
                  : 'text-coastal-cream/65 hover:bg-coastal-sky/10 hover:text-coastal-cream'
              )}
            >
              <span className={isActive ? 'opacity-60' : 'opacity-50'}>{section.num}</span>
              {navLabels[section.id]}
            </a>
          )
        })}
      </nav>

      {/* Footer of rail: language, CV, socials */}
      <div className="mt-auto flex flex-col gap-2.5">
        <div
          className="flex gap-1 rounded-full bg-black/[0.22] p-1 font-coastal-mono text-[11.5px]"
          role="group"
          aria-label="Language"
        >
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={cn(
              'flex-1 rounded-full py-[7px] text-center transition-opacity hover:opacity-90',
              language === 'en'
                ? 'bg-coastal-sky font-semibold text-coastal-green'
                : 'bg-transparent text-coastal-cream/55'
            )}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('fi')}
            className={cn(
              'flex-1 rounded-full py-[7px] text-center transition-opacity hover:opacity-90',
              language === 'fi'
                ? 'bg-coastal-sky font-semibold text-coastal-green'
                : 'bg-transparent text-coastal-cream/55'
            )}
          >
            FI
          </button>
        </div>
        <div className="text-center font-coastal-mono text-[10px] tracking-[.06em] text-coastal-cream/40">
          {t.langNote}
        </div>
        <a
          href="#cv"
          className="rounded-md bg-coastal-sky py-3 text-center font-coastal-mono text-[12.5px] font-semibold text-coastal-green transition-colors hover:bg-coastal-sky-hover"
        >
          {t.cv}
        </a>
        <div className="flex gap-2 font-coastal-mono text-[11.5px]">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-md border border-coastal-cream/[0.22] py-2.5 text-center text-coastal-cream transition-colors hover:border-coastal-sky hover:text-coastal-sky"
          >
            GitHub
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-md border border-coastal-cream/[0.22] py-2.5 text-center text-coastal-cream transition-colors hover:border-coastal-sky hover:text-coastal-sky"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </aside>
  )
}
