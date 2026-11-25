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
 *
 * v6: numbered chips, a page badge per chapter and icons on the links, so a
 * chapter and its page can be found without reading every summary.
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, BookOpen, ExternalLink, FileText, Users } from 'lucide-react'
import { guidebook, profile } from '@data/portfolio.data'
import { GuidebookCover, IconTile, PortfolioShell } from '@components/v5'

const pad = (n: number) => String(n).padStart(2, '0')

export function PMGuidebookPage() {
  useEffect(() => {
    document.title = `${guidebook.title} — ${profile.name}`
  }, [])

  return (
    <PortfolioShell>
      <section data-screen-label="Guidebook" className="pf5-section pf5-split">
        <div className="pf5-split__intro" style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
          <Link to="/#credentials" className="pf5-backlink pf6-iconrow">
            <ArrowLeft size={16} aria-hidden="true" /> Back to the portfolio
          </Link>
          <span className="pf5-eyebrow pf6-iconrow" style={{ gap: 10 }}>
            <IconTile icon={BookOpen} />
            {guidebook.eyebrow}
          </span>
          <h1 className="pf5-h2" style={{ marginBottom: 0 }}>{guidebook.title}</h1>
          <p className="pf5-lead">{guidebook.description}</p>
          <p className="pf5-muted" style={{ fontSize: 14, display: 'flex', gap: 8 }}>
            <Users size={16} aria-hidden="true" style={{ marginTop: 2 }} />
            {guidebook.credit}
          </p>
          <div className="pf5-gbpage__cover">
            <GuidebookCover />
          </div>
          <div className="pf5-actions">
            <a href={guidebook.pdfUrl} target="_blank" rel="noopener noreferrer" className="pf5-btn pf5-btn--primary pf5-btn--lg">
              <FileText size={18} aria-hidden="true" /> Read the full guidebook (PDF) <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="pf6-meta">
            <span className="pf6-iconrow"><BookOpen size={14} aria-hidden="true" />{guidebook.chapters.length} chapters</span>
            <span className="pf6-iconrow"><FileText size={14} aria-hidden="true" />{guidebook.pageCount} pages</span>
            <span className="pf6-iconrow"><ExternalLink size={14} aria-hidden="true" />opens in a new tab</span>
          </p>
        </div>

        <ol className="pf5-split__body pf5-chapters" aria-label="Chapters">
          {guidebook.chapters.map((chapter, i) => (
            <li key={chapter.title}>
              <span className="pf6-chapnum" aria-hidden="true">{pad(i + 1)}</span>
              <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                <div className="pf6-chaptitle">
                  <h2>
                    {chapter.title}
                    {guidebook.myChapters.includes(i + 1) && <span className="pf5-mine" style={{ marginLeft: 8 }}>Mine</span>}
                  </h2>
                  <span className="pf6-pagebadge">p. {chapter.page}</span>
                </div>
                <p>{chapter.summary}</p>
                <a href={`${guidebook.pdfUrl}#page=${chapter.page}`} target="_blank" rel="noopener noreferrer" className="pf6-iconrow">
                  Open at page {chapter.page} <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </PortfolioShell>
  )
}
