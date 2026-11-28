/**
 * ui.tsx — Small v6 building blocks shared by every section
 *
 * ONE ICON PER PLACE:
 *   SECTION_META gives each section its number, label and icon. The header
 *   nav and the section eyebrows both read it, so the icon you click in the
 *   nav is the icon you land on ("same icon = same place").
 *
 * ICONS ARE DECORATIVE:
 *   Every Lucide icon here sits next to a text label, so it's aria-hidden.
 *   Screen readers get the label; sighted visitors get both.
 */

import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Compass,
  Layers,
  Library,
  Lightbulb,
  Linkedin,
  Mail,
  Route,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

export type Tone = 'accent' | 'ok' | 'warn' | 'neutral'

// The numbers follow the order of the sections on the homepage
// (PortfolioV5Page → SECTIONS); keep the two in step.
export const SECTION_META = {
  work: { index: 1, label: 'Work', icon: Briefcase },
  credentials: { index: 2, label: 'Credentials', icon: Award },
  linkedin: { index: 3, label: 'LinkedIn', icon: Linkedin },
  skills: { index: 4, label: 'Skills', icon: Wrench },
  reading: { index: 5, label: 'Reading', icon: Library },
  github: { index: 6, label: 'Activity', icon: Activity },
  experience: { index: 7, label: 'Experience', icon: Route },
  approach: { index: 8, label: 'How I work', icon: Compass },
  questions: { index: 9, label: 'Questions', icon: Lightbulb },
  system: { index: 10, label: 'System', icon: Layers },
  contact: { index: 11, label: 'Contact', icon: Mail },
} satisfies Record<string, { index: number; label: string; icon: LucideIcon }>

export type SectionKey = keyof typeof SECTION_META

/** The guidebook has its own route but shares the icon language. */
export const GUIDEBOOK_ICON = BookOpen

/** An icon on a tinted square. */
export function IconTile({ icon: Icon, tone = 'accent', size = 'sm' }: { icon: LucideIcon; tone?: Tone; size?: 'sm' | 'md' }) {
  const toneClass = tone === 'accent' ? '' : ` pf6-tile--${tone}`
  return (
    <span aria-hidden="true" className={`pf6-tile${size === 'md' ? ' pf6-tile--md' : ''}${toneClass}`}>
      <Icon size={size === 'md' ? 20 : 16} />
    </span>
  )
}

/**
 * "[icon] 01 — WORK" above a section heading. Hidden from screen readers:
 * it repeats the nav label, and the h2 right below it names the section.
 */
export function SectionEyebrow({ section }: { section: SectionKey }) {
  const { index, label, icon } = SECTION_META[section]
  return (
    <p className="pf6-eyebrow" aria-hidden="true">
      <IconTile icon={icon} />
      <span className="pf6-eyebrow__num">{String(index).padStart(2, '0')}</span>
      <span className="pf6-eyebrow__rule" />
      <span className="pf6-eyebrow__label">{label}</span>
    </p>
  )
}

const GITHUB_HOSTS = ['github.com', 'www.github.com']

/**
 * The parsed URL if it points at GitHub, otherwise null.
 *
 * WHY PARSE INSTEAD OF url.includes('github.com')?
 *   A substring check also matches "https://evil.net/github.com/..." or
 *   "https://github.com.evil.net". Parsing first and comparing the exact
 *   hostname against an allow-list can't be fooled that way.
 */
export function parseGitHubUrl(url: string | null | undefined): URL | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    const webProtocol = parsed.protocol === 'https:' || parsed.protocol === 'http:'
    return webProtocol && GITHUB_HOSTS.includes(parsed.hostname) ? parsed : null
  } catch {
    return null // not a valid absolute URL
  }
}

/** "Python · FastAPI · Kafka" → a row of pills. */
export function StackPills({ stack, label = 'Stack' }: { stack: string; label?: string }) {
  return (
    <ul className="pf6-pills" aria-label={label}>
      {stack.split(' · ').map(item => <li key={item} className="pf6-pill">{item}</li>)}
    </ul>
  )
}
