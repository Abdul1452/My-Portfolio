/**
 * ProfileSections.tsx — Skills, GitHub activity, exploring, experience
 * (Certificates live in CertificateWall.tsx.)
 *
 * The "evidence" half of the page. Every section returns null when its
 * data is empty, so a section can be hidden from portfolio.data.ts alone.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  exploring,
  profile,
  skillGroups,
  timeline,
} from '@data/portfolio.data'
import activity from '@data/github-activity.json'
import {
  Activity,
  Briefcase,
  CircleCheck,
  CodeXml,
  Database,
  Flame,
  Github,
  GraduationCap,
  Layers,
  Server,
  Sprout,
  Star,
  Trophy,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { IconTile, SectionEyebrow } from './ui'

const TIMELINE_ICON: Record<'work' | 'study' | 'hackathon', LucideIcon> = {
  work: Briefcase,
  study: GraduationCap,
  hackathon: Trophy,
}

const SKILL_GROUP_ICON: Record<string, LucideIcon> = {
  'Backend': Server,
  'Data & delivery': Database,
  'Frontend': CodeXml,
  'Project management': Layers,
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export function SkillsSection() {
  if (!skillGroups.length) return null

  return (
    <section id="skills" data-screen-label="Skills" className="pf5-section pf5-split">
      <div className="pf5-split__intro">
        <SectionEyebrow section="skills" />
        <h2 className="pf5-h2">Skills, then the projects that use them</h2>
        <p className="pf5-lead">
          I’ve marked depth plainly. “Shipped” means I’ve used it in a finished project or an internship.
          “Learning” means it’s only in a project that’s still in progress.
        </p>
        {/* Icon + words, so the legend doesn't rely on colour alone (WCAG 1.4.1). */}
        <ul className="pf6-legend">
          <li><CircleCheck size={16} className="pf6-c-ok" aria-hidden="true" /><span className="pf5-skill">Shipped</span></li>
          <li><Sprout size={16} className="pf6-c-muted" aria-hidden="true" /><span className="pf5-skill pf5-skill--learning">Learning</span></li>
        </ul>
      </div>

      <div className="pf5-split__body pf5-skillgrid">
        {skillGroups.map(group => {
          const shipped = group.skills.filter(s => s.level === 'shipped').length
          const learning = group.skills.length - shipped
          return (
          <div key={group.title} className="pf5-skillcard">
            <div className="pf5-skillcard__head">
              <h3 className="pf6-skillcard__title">
                <IconTile icon={SKILL_GROUP_ICON[group.title] ?? Wrench} />
                {group.title}
              </h3>
              <span className="pf5-muted" style={{ fontSize: 12.5 }}>
                {shipped} shipped{learning > 0 && ` · ${learning} learning`}
              </span>
            </div>
            {/* Confidence bar: one segment per skill, solid = shipped, dashed = learning. */}
            <div className="pf6-confidence" aria-hidden="true">
              {group.skills.map(skill => <span key={skill.name} data-level={skill.level} />)}
            </div>
            <div className="pf5-skills">
              {group.skills.map(skill => (
                <span key={skill.name} className={skill.level === 'learning' ? 'pf5-skill pf5-skill--learning' : 'pf5-skill'}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── GitHub activity ──────────────────────────────────────────────────────────
// Reads the snapshot written by scripts/fetch-github-activity.mjs.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Five shades from "nothing" to "a lot", all derived from the accent token
// so they follow the theme.
const LEVEL_COLORS = [
  'var(--line)',
  'color-mix(in oklch, var(--accent) 30%, var(--surface))',
  'color-mix(in oklch, var(--accent) 55%, var(--surface))',
  'color-mix(in oklch, var(--accent) 80%, var(--surface))',
  'var(--accent)',
]
const levelFor = (count: number) => (count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4)

// Dates are plain "YYYY-MM-DD" strings; read them as UTC so the weekday
// doesn't shift with the visitor's timezone.
const asDate = (iso: string) => new Date(`${iso}T00:00:00Z`)
const formatDay = (iso: string) => {
  const d = asDate(iso)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}
const describe = (count: number, iso: string) =>
  `${count || 'No'} ${count === 1 ? 'contribution' : 'contributions'} on ${formatDay(iso)}`

export function GitHubActivity() {
  const [hovered, setHovered] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Lay the days out like GitHub does: one column per week, Sunday on top.
  const { cells, monthLabels } = useMemo(() => {
    const firstWeekday = asDate(activity.days[0].date).getUTCDay()
    const cells = activity.days.map((day, i) => ({
      ...day,
      row: ((firstWeekday + i) % 7) + 1,
      week: Math.floor((firstWeekday + i) / 7),
    }))
    const monthLabels: { col: number; label: string }[] = []
    let lastMonth = -1
    for (const cell of cells) {
      const month = asDate(cell.date).getUTCMonth()
      if (cell.row !== 1 || month === lastMonth) continue
      // Skip a label that would crowd the previous one.
      const previous = monthLabels[monthLabels.length - 1]
      if (previous && cell.week + 1 - previous.col < 3) monthLabels.pop()
      if (cell.week < 51) monthLabels.push({ col: cell.week + 1, label: MONTHS[month] })
      lastMonth = month
    }
    return { cells, monthLabels }
  }, [])

  // Start scrolled to the most recent weeks on narrow screens.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
  }, [])

  const fetched = formatDay(activity.fetchedAt.slice(0, 10))
  const footText = hovered !== null
    ? describe(cells[hovered].count, cells[hovered].date)
    : `Snapshot from ${fetched}. Hover a day for details.`

  return (
    <div className="pf5-box pf5-gh">
      <div className="pf5-sectionhead" style={{ marginBottom: 0 }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <h3 className="pf5-h3">GitHub activity</h3>
          <p className="pf6-inlinestats">
            <span className="pf6-iconrow"><Activity size={16} className="pf6-c-accent" aria-hidden="true" />{activity.total} contributions in the last year</span>
            <span className="pf6-iconrow"><Flame size={16} className="pf6-c-warn" aria-hidden="true" />longest streak {activity.longestStreak} days</span>
          </p>
        </div>
        <a href={profile.links.github} target="_blank" rel="noreferrer" className="pf5-btn pf5-btn--ghost" style={{ fontWeight: 500 }}>
          <Github size={16} aria-hidden="true" /> @{profile.links.githubLogin} ↗
        </a>
      </div>

      <div ref={scrollRef} className="pf5-gh__scroll">
        <div className="pf5-gh__grid">
          <span />
          <div className="pf5-gh__months" aria-hidden="true">
            {monthLabels.map(m => (
              <span key={`${m.col}-${m.label}`} style={{ gridColumn: m.col }}>{m.label}</span>
            ))}
          </div>
          <div className="pf5-gh__days" aria-hidden="true">
            <span /><span>Mon</span><span /><span>Wed</span><span /><span>Fri</span><span />
          </div>
          <div
            className="pf5-gh__cells"
            role="img"
            aria-label={`${activity.total} GitHub contributions in the last year`}
            onMouseLeave={() => setHovered(null)}
          >
            {cells.map((cell, i) => (
              <span
                key={cell.date}
                className="pf5-gh__cell"
                title={describe(cell.count, cell.date)}
                onMouseEnter={() => setHovered(i)}
                style={{
                  gridRow: cell.row,
                  background: LEVEL_COLORS[levelFor(cell.count)],
                  outline: hovered === i ? '1.5px solid var(--ink)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pf5-gh__foot">
        <span style={{ minHeight: 18, color: 'var(--ink-2)' }}>{footText}</span>
        <div className="pf5-gh__legend" aria-hidden="true">
          <span style={{ marginRight: 4 }}>Less</span>
          {LEVEL_COLORS.map(color => (
            <span key={color} className="pf5-gh__cell" style={{ background: color }} />
          ))}
          <span style={{ marginLeft: 4 }}>More</span>
        </div>
      </div>
    </div>
  )
}

export function ExploringList() {
  if (!exploring.length) return null

  return (
    <div className="pf5-box" style={{ display: 'grid', gap: 18 }}>
      <div style={{ display: 'grid', gap: 6 }}>
        <h3 className="pf5-h3">What I’m exploring</h3>
        <p style={{ fontSize: 15, color: 'var(--ink-2)' }}>
          Repositories I’ve starred on GitHub: other people’s work I’m reading and learning from.
        </p>
      </div>
      <div className="pf5-rows">
        {exploring.map(repo => (
          <a key={repo.name} href={repo.url} target="_blank" rel="noreferrer" className="pf5-row">
            <span aria-hidden="true" className="pf5-row__mark"><Star size={16} /></span>
            <span className="pf5-row__text">
              <span className="pf5-row__title mono" style={{ fontSize: 14 }}>{repo.name}</span>
              <span className="pf5-row__sub">{repo.note}</span>
            </span>
            <span aria-hidden="true" className="pf5-row__aside">↗</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export function GitHubSection() {
  return (
    <section id="github" data-screen-label="GitHub" className="pf5-section pf5-section--tight-top" style={{ display: 'grid', gap: 16 }}>
      <SectionEyebrow section="github" />
      <GitHubActivity />
      <ExploringList />
    </section>
  )
}

// Certifications + the PM guidebook card moved to CertificateWall.tsx.

// ─── Experience & studies ─────────────────────────────────────────────────────

export function ExperienceSection() {
  if (!timeline.length) return null

  return (
    <section id="experience" data-screen-label="Experience" className="pf5-section pf5-split">
      <div className="pf5-split__intro">
        <SectionEyebrow section="experience" />
        <h2 className="pf5-h2">Experience and studies</h2>
        <p className="pf5-lead">Most recent first.</p>
      </div>
      <ol className="pf5-split__body pf5-timeline">
        {timeline.map((item, i) => (
          <li key={`${item.period}-${item.title}`}>
            {/* Briefcase = work, cap = study, trophy = hackathon; the most recent entry in accent. */}
            <span className="pf6-timeline__icon">
              <IconTile
                icon={TIMELINE_ICON[item.kind]}
                tone={i === 0 ? 'accent' : item.kind === 'study' ? 'ok' : item.kind === 'hackathon' ? 'warn' : 'neutral'}
              />
            </span>
            <p className="pf5-timeline__period">{item.period}</p>
            <h3>{item.title}</h3>
            <p className="pf5-timeline__org">{item.org}</p>
            <p className="pf5-timeline__text">{item.text}</p>
            {item.highlights && (
              <ul className="pf5-timeline__highlights">
                {item.highlights.map(h => <li key={h}>{h}</li>)}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
