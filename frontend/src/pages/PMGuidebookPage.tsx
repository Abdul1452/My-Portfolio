/**
 * PMGuidebookPage.tsx — The Project Management Guidebook (/pm)
 *
 * A SECONDARY PAGE:
 *   The homepage shows the guidebook as a card with a chapter preview. This
 *   page gives it a permanent address (/pm): every chapter with its summary
 *   and a link that opens the PDF at that chapter, plus the full PDF.
 *
 * ONE SOURCE OF TRUTH:
 *   Chapters, summaries and the PDF path come from the `guidebook` object in
 *   portfolio.data.ts, the same data the homepage preview uses.
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { guidebook, profile } from '@data/portfolio.data'
import { GuidebookCover, PortfolioShell } from '@components/v5'

const pad = (n: number) => String(n).padStart(2, '0')

export function PMGuidebookPage() {
  useEffect(() => {
    document.title = `${guidebook.title} — ${profile.name}`
  }, [])

  return (
    <PortfolioShell>
      <section data-screen-label="Guidebook" className="pf5-section pf5-split">
        <div className="pf5-split__intro" style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
          <Link to="/#credentials" className="pf5-backlink">← Back to the portfolio</Link>
          <span className="pf5-eyebrow">{guidebook.eyebrow}</span>
          <h1 className="pf5-h2" style={{ marginBottom: 0 }}>{guidebook.title}</h1>
          <p className="pf5-lead">{guidebook.description}</p>
          <p className="pf5-muted" style={{ fontSize: 14 }}>{guidebook.credit}</p>
          <div className="pf5-gbpage__cover">
            <GuidebookCover />
          </div>
          <div className="pf5-actions">
            <a href={guidebook.pdfUrl} target="_blank" rel="noopener noreferrer" className="pf5-btn pf5-btn--primary pf5-btn--lg">
              Read the full guidebook (PDF)
            </a>
          </div>
          <p className="pf5-muted" style={{ fontSize: 13.5 }}>
            {guidebook.chapters.length} chapters · {guidebook.pageCount} pages · opens in a new tab
          </p>
        </div>

        <ol className="pf5-split__body pf5-chapters" aria-label="Chapters">
          {guidebook.chapters.map((chapter, i) => (
            <li key={chapter.title}>
              <span className="pf5-chapters__num">{pad(i + 1)}</span>
              <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                <h2>
                  {chapter.title}
                  {guidebook.myChapters.includes(i + 1) && <span className="pf5-mine" style={{ marginLeft: 8 }}>Mine</span>}
                </h2>
                <p>{chapter.summary}</p>
                <a href={`${guidebook.pdfUrl}#page=${chapter.page}`} target="_blank" rel="noopener noreferrer">
                  Open at page {chapter.page} ↗
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </PortfolioShell>
  )
}
