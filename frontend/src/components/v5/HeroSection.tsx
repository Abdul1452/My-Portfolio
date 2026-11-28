/**
 * HeroSection.tsx — First screen: the story headline, the route, two cards, KPI strip
 *
 * The headline lines rise in one after another: each <span> gets the same
 * CSS animation (pf5-rise) with a slightly later animation-delay.
 *
 * v7 (storytelling): the headline is a "before → after" story instead of a
 * job title, a small route under it (hero.journey) lists the chapters, and
 * the Three.js globe behind the cards (HeroScene) draws the same journey,
 * Lagos → Turku. All the words live in portfolio.data.ts → hero.
 *
 * A strip of four numbers under the hero gives the proof at a glance. Every
 * number is counted from the existing data, so it can't drift from what
 * the page says further down.
 */

import { Fragment } from 'react'
import { Activity, ArrowRight, Award, Briefcase, Check, FolderGit2, Github, Linkedin, type LucideIcon } from 'lucide-react'
import { certifications, featuredProjects, hero, nowCard, profile, timeline } from '@data/portfolio.data'
import activity from '@data/github-activity.json'
import { HeroScene } from './HeroScene'
import { IconTile, type Tone } from './ui'
import { usePortfolioThemeContext } from './usePortfolioTheme'

const internships = timeline.filter(item => item.kind === 'work' && /internship/i.test(item.title)).length
// Hackathon participation certificates are listed with the certifications
// but aren't certifications, so they don't count here.
const certificationCount = certifications.filter(cert => cert.kind !== 'hackathon').length

const HIGHLIGHTS: { value: number; label: string; icon: LucideIcon; tone: Tone }[] = [
  { value: internships, label: 'internships at theFIRMA, Turku UAS', icon: Briefcase, tone: 'accent' },
  { value: featuredProjects.length, label: 'projects you can try on this page', icon: FolderGit2, tone: 'warn' },
  { value: activity.total, label: 'GitHub contributions in the last year', icon: Activity, tone: 'accent' },
  { value: certificationCount, label: 'certifications, incl. PRY (IPMA ICB)', icon: Award, tone: 'ok' },
]

export function HeroSection() {
  const { reduceMotion } = usePortfolioThemeContext()
  const doneCount = nowCard.items.filter(item => item.done).length
  const lines = [...hero.headline, hero.headlineMuted]

  return (
    <>
      <section data-screen-label="Hero" className="pf5-hero">
        <div className="pf5-hero__text">
          <div className="pf7-hero__top">
            <p className="pf5-status">
              <span aria-hidden="true" className="pf5-status__dot" />
              {hero.status}
            </p>
            <p className="pf7-kicker">{hero.kicker}</p>
          </div>

          <h1 className="pf5-h1 pf7-h1">
            {lines.map((line, i) => (
              // The space goes between the spans, not inside them: browsers
              // drop trailing spaces inside inline-block elements.
              <Fragment key={line}>
                <span
                  className={i === lines.length - 1 ? 'pf5-h1__muted pf7-h1__after' : undefined}
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  {line}
                </span>{' '}
              </Fragment>
            ))}
          </h1>

          <p className="pf5-hero__intro">{hero.intro}</p>

          {/* The story as a route: one stop per chapter, the last one open. */}
          <ol className="pf7-journey" aria-label="The story so far">
            {hero.journey.map((stop, i) => (
              <li key={stop.year} data-last={i === hero.journey.length - 1} style={{ animationDelay: `${0.35 + i * 0.08}s` }}>
                <span className="pf7-journey__year">{stop.year}</span>
                <span className="pf7-journey__place">{stop.place}</span>
                <span className="pf7-journey__text">{stop.text}</span>
              </li>
            ))}
          </ol>

          <div className="pf5-actions">
            <a href="#work" className="pf5-btn pf5-btn--primary pf5-btn--lg">
              See what I’ve built <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="pf5-btn pf5-btn--ghost pf5-btn--lg">
              <Linkedin size={18} aria-hidden="true" /> LinkedIn
            </a>
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="pf5-btn pf5-btn--ghost pf5-btn--lg">
              <Github size={18} aria-hidden="true" /> GitHub
            </a>
          </div>
        </div>

        {/* Right column: the globe gets the stage to itself (only a small
            name chip on it), so the Lagos → Turku route stays visible.
            The "now" card sits under it. */}
        <div className="pf7-hero__side">
        <div role="group" aria-label="Profile summary" className="pf5-hero__stage pf6-stage pf7-stage">
          <HeroScene reduceMotion={reduceMotion} />

          <div className="pf5-card pf7-idchip">
            <img className="pf5-avatar" src={profile.avatarUrl} alt={`Photo of ${profile.name}`} width={44} height={44} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: 15 }}>{profile.name}</p>
              <p className="pf5-muted" style={{ marginTop: 1, fontSize: 12.5 }}>{hero.facts.map(f => f.value).slice(0, 2).join(' · ')}</p>
            </div>
          </div>
        </div>

          <div className="pf5-card pf5-now pf7-now">
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
