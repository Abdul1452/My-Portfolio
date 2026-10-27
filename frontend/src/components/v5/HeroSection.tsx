/**
 * HeroSection.tsx — First screen: headline, intro and two summary cards
 *
 * The headline lines rise in one after another: each <span> gets the same
 * CSS animation (pf5-rise) with a slightly later animation-delay.
 */

import { hero, nowCard, profile } from '@data/portfolio.data'

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

export function HeroSection() {
  const doneCount = nowCard.items.filter(item => item.done).length
  const lines = [...hero.headline, hero.headlineMuted]

  return (
    <section data-screen-label="Hero" className="pf5-hero">
      <div className="pf5-hero__text">
        <p className="pf5-status">
          <span aria-hidden="true" className="pf5-status__dot" />
          {hero.status}
        </p>

        <h1 className="pf5-h1">
          {lines.map((line, i) => (
            <span
              key={line}
              className={i === lines.length - 1 ? 'pf5-h1__muted' : undefined}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {line}{' '}
            </span>
          ))}
        </h1>

        <p className="pf5-hero__intro">{hero.intro}</p>

        <div className="pf5-actions">
          <a href="#work" className="pf5-btn pf5-btn--primary pf5-btn--lg">Try the projects</a>
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="pf5-btn pf5-btn--ghost pf5-btn--lg">
            GitHub profile
          </a>
        </div>
      </div>

      <div role="group" aria-label="Profile summary" className="pf5-hero__stage pf5-stage--lake">
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
                  {item.done && <CheckIcon />}
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
  )
}
