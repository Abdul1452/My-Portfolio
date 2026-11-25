/**
 * HeroSection.tsx — First screen: headline, intro, two summary cards, KPI strip
 *
 * The headline lines rise in one after another: each <span> gets the same
 * CSS animation (pf5-rise) with a slightly later animation-delay.
 *
 * v6: the cards float as glass over the Three.js "stack constellation"
 * (HeroScene), and a strip of four numbers under the hero gives the proof
 * at a glance. Every number is counted from the existing data, so it can't
 * drift from what the page says further down.
 */

import { Fragment } from 'react'
import { Activity, ArrowRight, Award, Briefcase, Check, FolderGit2, Github, type LucideIcon } from 'lucide-react'
import { certifications, featuredProjects, hero, nowCard, profile, timeline } from '@data/portfolio.data'
import activity from '@data/github-activity.json'
import { HeroScene } from './HeroScene'
import { IconTile, type Tone } from './ui'
import { usePortfolioThemeContext } from './usePortfolioTheme'

const internships = timeline.filter(item => item.kind === 'work' && /internship/i.test(item.title)).length

const HIGHLIGHTS: { value: number; label: string; icon: LucideIcon; tone: Tone }[] = [
  { value: internships, label: 'internships at theFIRMA, Turku UAS', icon: Briefcase, tone: 'accent' },
  { value: featuredProjects.length, label: 'projects you can try on this page', icon: FolderGit2, tone: 'warn' },
  { value: activity.total, label: 'GitHub contributions in the last year', icon: Activity, tone: 'accent' },
  { value: certifications.length, label: 'certifications, incl. PRY (IPMA ICB)', icon: Award, tone: 'ok' },
]

export function HeroSection() {
  const { theme, reduceMotion } = usePortfolioThemeContext()
  const doneCount = nowCard.items.filter(item => item.done).length
  const lines = [...hero.headline, hero.headlineMuted]

  return (
    <>
      <section data-screen-label="Hero" className="pf5-hero">
        <div className="pf5-hero__text">
          <p className="pf5-status">
            <span aria-hidden="true" className="pf5-status__dot" />
            {hero.status}
          </p>

          <h1 className="pf5-h1">
            {lines.map((line, i) => (
              // The space goes between the spans, not inside them: browsers
              // drop trailing spaces inside inline-block elements.
              <Fragment key={line}>
                <span
                  className={i === lines.length - 1 ? 'pf5-h1__muted' : undefined}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  {line}
                </span>{' '}
              </Fragment>
            ))}
          </h1>

          <p className="pf5-hero__intro">{hero.intro}</p>

          <div className="pf5-actions">
            <a href="#work" className="pf5-btn pf5-btn--primary pf5-btn--lg">
              Try the projects <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="pf5-btn pf5-btn--ghost pf5-btn--lg">
              <Github size={18} aria-hidden="true" /> GitHub profile
            </a>
          </div>
        </div>

        <div role="group" aria-label="Profile summary" className="pf5-hero__stage pf5-stage--lake pf6-stage">
          <HeroScene theme={theme} reduceMotion={reduceMotion} />

          <div className="pf5-card pf5-profile">
            <div className="pf5-profile__head">
              <img className="pf5-avatar" src={profile.avatarUrl} alt={`Photo of ${profile.name}`} width={52} height={52} />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 16 }}>{profile.name}</p>
                <p className="pf5-muted" style={{ marginTop: 2, fontSize: 13.5 }}>{profile.role}</p>
              </div>
            </div>
            <dl className="pf5-facts">
              {hero.facts.map(fact => (
                <div key={fact.label} style={{ display: 'contents' }}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="pf5-card pf5-now">
            <p style={{ marginBottom: 12, fontWeight: 600, fontSize: 15 }}>{nowCard.title}</p>
            <ol>
              {nowCard.items.map(item => (
                <li key={item.label} data-done={item.done}>
                  <span aria-hidden="true" className={item.done ? 'pf5-tick' : 'pf5-tick pf5-tick--open'}>
                    {item.done && <Check size={11} strokeWidth={3.2} />}
                  </span>
                  {item.label}
                  <span className="pf5-sr-only">{item.done ? ' (done)' : ' (in progress)'}</span>
                </li>
              ))}
            </ol>
            <div aria-hidden="true" className="pf5-progress">
              <div style={{ width: `${(doneCount / nowCard.items.length) * 100}%` }} />
            </div>
            <p className="pf5-muted" style={{ marginTop: 8, fontSize: 12.5 }}>
              {doneCount} of {nowCard.items.length} done
            </p>
          </div>
        </div>
      </section>

      <ul className="pf6-kpis" aria-label="Highlights">
        {HIGHLIGHTS.map(item => (
          <li key={item.label} className="pf6-stat">
            <IconTile icon={item.icon} tone={item.tone} />
            <span className="pf6-stat__value">{item.value}</span>
            <span className="pf6-stat__label">{item.label}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
