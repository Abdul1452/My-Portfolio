/**
 * WorkSection.tsx — "Three projects you can try" + the case studies under it
 *
 * Both read the same featuredProjects list: the tiles show what each
 * project does, the case studies explain why and how.
 */

import type { ReactNode } from 'react'
import { featuredProjects, type FeaturedProject } from '@data/portfolio.data'
import { FraudScoreTile, MovePlanTile, QuoteApiTile } from './DemoTiles'
import { usePortfolioThemeContext } from './usePortfolioTheme'

// Each tile sits on a different gradient, in the design's order.
const STAGES = ['pf5-stage--clay', 'pf5-stage--birch', 'pf5-stage--dusk']

function renderTile(project: FeaturedProject, reduceMotion: boolean): ReactNode {
  switch (project.tile) {
    case 'move-plan': return <MovePlanTile />
    case 'quote-api': return <QuoteApiTile reduceMotion={reduceMotion} />
    case 'fraud-score': return <FraudScoreTile />
  }
}

export function WorkSection() {
  const { reduceMotion } = usePortfolioThemeContext()

  return (
    <section id="work" data-screen-label="Work" className="pf5-section">
      <div className="pf5-sectionhead">
        <div>
          <h2 className="pf5-h2">Three projects you can try</h2>
          <p className="pf5-lead">Each tile is a small working model of the idea behind the project, not a recording.</p>
        </div>
        <a href={`#case-${featuredProjects[0].id}`} style={{ fontSize: 15, fontWeight: 500, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>
          Read the case studies ↓
        </a>
      </div>

      <div className="pf5-tiles">
        {featuredProjects.map((project, i) => (
          <article key={project.id} className="pf5-tile">
            <div className={`pf5-stage pf5-tile__stage ${STAGES[i % STAGES.length]}`}>
              {renderTile(project, reduceMotion)}
            </div>
            <div>
              <h3 className="pf5-tile__title">{project.title}</h3>
              <p className="pf5-tile__caption">{project.tileCaption}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function CaseStudies() {
  return (
    <section data-screen-label="Case studies" className="pf5-cases">
      {featuredProjects.map(project => (
        <article key={project.id} id={`case-${project.id}`} className="pf5-case">
          <div className="pf5-case__text">
            <div className="pf5-case__badges">
              <span className={project.badge === 'In progress' ? 'pf5-badge pf5-badge--warn' : 'pf5-badge'}>{project.badge}</span>
              <span className="pf5-badge pf5-badge--outline">{project.meta}</span>
            </div>
            <h3 className="pf5-case__title">{project.title}</h3>
            <dl className="pf5-case__dl">
              <div><dt>Problem</dt><dd>{project.problem}</dd></div>
              <div><dt>What I did</dt><dd>{project.whatIDid}</dd></div>
              <div><dt>Result</dt><dd>{project.result}</dd></div>
            </dl>
            <div className="pf5-actions" style={{ gap: 8 }}>
              {project.links.map(link => (
                <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="pf5-btn pf5-btn--ghost">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="pf5-case__side">
            <div className="pf5-shot">
              <img src={project.imageUrl} alt={project.imageAlt} loading="lazy" width={1200} height={600} />
            </div>
            <table className="pf5-table">
              <tbody>
                <tr><th scope="row">Role</th><td>{project.role}</td></tr>
                <tr><th scope="row">Team</th><td>{project.team}</td></tr>
                <tr><th scope="row">Stack</th><td className="mono" style={{ fontSize: 13 }}>{project.stack}</td></tr>
              </tbody>
            </table>
          </div>
        </article>
      ))}
    </section>
  )
}
