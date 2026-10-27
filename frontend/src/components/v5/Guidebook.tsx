/**
 * Guidebook.tsx — The project management guidebook card + chapter preview
 *
 * HOW IT FLOWS:
 *   1. GuidebookCard shows the cover and a summary. It's one big button.
 *   2. Clicking it opens GuidebookPreview, a modal dialog: the chapter list
 *      on the left, the selected chapter's summary on the right.
 *   3. "Read the full guidebook (PDF)" opens the real PDF in a new tab;
 *      "Open at this chapter" adds #page=N so the browser's PDF viewer
 *      jumps straight to that chapter.
 *
 * ACCESSIBILITY (what a modal must do):
 *   - role="dialog" + aria-modal + a label, so screen readers announce it
 *   - focus moves into the dialog when it opens, and Tab stays inside it
 *   - Esc or a click on the dimmed backdrop closes it
 *   - focus returns to the card that opened it
 *   - the page behind stops scrolling while it's open
 */

import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { guidebook } from '@data/portfolio.data'

const pad = (n: number) => String(n).padStart(2, '0')

/** "3 and 5" / "2, 4 and 7" */
function formatList(numbers: number[]) {
  if (numbers.length < 2) return numbers.join('')
  return `${numbers.slice(0, -1).join(', ')} and ${numbers[numbers.length - 1]}`
}

/** A small CSS recreation of the PDF's cover, so no image file is needed. */
export function GuidebookCover() {
  return (
    <span className="pf5-gbcover" aria-hidden="true">
      <span className="pf5-gbcover__year">{guidebook.year}</span>
      <span className="pf5-gbcover__title">Project Management Guidebook</span>
      <span className="pf5-gbcover__group">GROUP 3</span>
    </span>
  )
}

function GuidebookPreview({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // On open: focus the close button, listen for Esc, freeze page scroll.
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  // Keep Tab / Shift+Tab cycling inside the dialog.
  function trapFocus(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab' || !panelRef.current) return
    const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const chapter = guidebook.chapters[active]
  const showAuthorship = guidebook.myChapters.length > 0
  const isMine = guidebook.myChapters.includes(active + 1)

  return (
    <div className="pf5-modal" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pf5-guidebook-title"
        className="pf5-modal__panel"
        onClick={e => e.stopPropagation()}
        onKeyDown={trapFocus}
      >
        <div className="pf5-modal__head">
          <div style={{ display: 'grid', gap: 2, minWidth: 0 }}>
            <span id="pf5-guidebook-title" style={{ fontSize: 18, fontWeight: 600 }}>{guidebook.title}</span>
            <span className="pf5-muted" style={{ fontSize: 13.5 }}>{guidebook.credit}</span>
          </div>
          <button ref={closeRef} type="button" className="pf5-iconbtn" aria-label="Close preview" onClick={onClose} style={{ fontSize: 20, flex: '0 0 auto' }}>
            ×
          </button>
        </div>

        <div className="pf5-modal__body">
          <nav className="pf5-toc" aria-label="Chapters">
            <span className="pf5-toc__label">Contents</span>
            {guidebook.chapters.map((ch, i) => (
              <button key={ch.title} type="button" aria-current={i === active} onClick={() => setActive(i)}>
                <span className="pf5-toc__num">{pad(i + 1)}</span>
                <span style={{ flex: '1 1 auto' }}>{ch.title}</span>
                {guidebook.myChapters.includes(i + 1) && <span className="pf5-mine">Mine</span>}
              </button>
            ))}
          </nav>

          <div className="pf5-chapter" aria-live="polite">
            <span className="mono pf5-muted" style={{ fontSize: 13 }}>Chapter {pad(active + 1)} · page {chapter.page}</span>
            <h4>{chapter.title}</h4>
            <p className="pf5-chapter__text">{chapter.summary}</p>
            {showAuthorship && (
              <p className="pf5-muted" style={{ fontSize: 14 }}>
                {isMine ? 'I wrote this chapter.' : 'Written by a teammate.'}
              </p>
            )}
            <div className="pf5-actions" style={{ marginTop: 8 }}>
              <a href={guidebook.pdfUrl} target="_blank" rel="noopener noreferrer" className="pf5-btn pf5-btn--primary pf5-btn--lg">
                Read the full guidebook (PDF)
              </a>
              <a href={`${guidebook.pdfUrl}#page=${chapter.page}`} target="_blank" rel="noopener noreferrer" className="pf5-btn pf5-btn--ghost pf5-btn--lg">
                Open at this chapter ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GuidebookCard() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // useCallback keeps onClose stable, so the preview's effect (which
  // depends on it) runs once on open rather than on every render.
  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  const mine = guidebook.myChapters

  return (
    <>
      <button ref={triggerRef} type="button" className="pf5-box pf5-gbcard" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <GuidebookCover />
        <span className="pf5-gbcard__body">
          <span className="pf5-eyebrow">{guidebook.eyebrow}</span>
          <span className="pf5-gbcard__title">{guidebook.title}</span>
          <span className="pf5-gbcard__text">{guidebook.description}</span>
          <span className="pf5-gbcard__pills">
            <span>{guidebook.chapters.length} chapters</span>
            <span>{guidebook.pageCount} pages</span>
            {mine.length > 0 && <span>My part: chapter{mine.length > 1 ? 's' : ''} {formatList(mine)}</span>}
          </span>
          <span className="pf5-gbcard__cta">Open preview →</span>
        </span>
      </button>
      {open && <GuidebookPreview onClose={close} />}
    </>
  )
}
