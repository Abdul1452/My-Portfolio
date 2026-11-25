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
  Lightbulb,
  Mail,
  Route,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

export type Tone = 'accent' | 'ok' | 'warn' | 'neutral'

export const SECTION_META = {
  work: { index: 1, label: 'Work', icon: Briefcase },
  skills: { index: 2, label: 'Skills', icon: Wrench },
  github: { index: 3, label: 'Activity', icon: Activity },
  credentials: { index: 4, label: 'Credentials', icon: Award },
  experience: { index: 5, label: 'Experience', icon: Route },
  approach: { index: 6, label: 'How I work', icon: Compass },
  questions: { index: 7, label: 'Questions', icon: Lightbulb },
  system: { index: 8, label: 'System', icon: Layers },
  contact: { index: 9, label: 'Contact', icon: Mail },
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

/** "Python · FastAPI · Kafka" → a row of pills. */
export function StackPills({ stack, label = 'Stack' }: { stack: string; label?: string }) {
  return (
    <ul className="pf6-pills" aria-label={label}>
      {stack.split(' · ').map(item => <li key={item} className="pf6-pill">{item}</li>)}
    </ul>
  )
}
