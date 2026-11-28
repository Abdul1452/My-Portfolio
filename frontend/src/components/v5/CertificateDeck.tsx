/**
 * CertificateDeck.tsx — Certificates as a stacked deck you can swipe through
 *
 * WHY A DECK:
 *   Every certificate is visible as a picture (no "View ↗" to click), and a
 *   pile of paper is the natural way to leaf through eleven of them: the
 *   top one is large enough to read, the next few peek out behind it.
 *
 * HOW YOU MOVE THROUGH IT:
 *   - drag/swipe the top card left → next (it flies off and goes to the
 *     back of the queue); right → previous
 *   - the ← → buttons, or the arrow keys when the deck has focus
 *   - the dots under the deck, or the "Up next" list beside it
 *   - click (or Enter) the top card to see it full size, in a native
 *     <dialog> with the same arrows
 *
 * HOW IT'S BUILT:
 *   The visible part of the queue (the top card + 3 behind it) is rendered
 *   with a key per certificate, so when the order changes React keeps each
 *   card's element and CSS transitions animate it to its new place in the
 *   pile. Dragging writes the card's transform directly from pointer
 *   events; touch-action: pan-y keeps vertical swipes scrolling the page.
 *   Reduced motion: no flying, cards just change.
 *
 * Pictures come from `preview` in portfolio.data.ts. A certificate without
 * one (or whose image fails to load) is drawn as a paper card from its text.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { BadgeCheck, ChevronLeft, ChevronRight, FileText, Hand, Maximize2, X } from 'lucide-react'
import { certifications, type Certification } from '@data/portfolio.data'
import { GuidebookCard } from './Guidebook'
import { SectionEyebrow } from './ui'
import { usePortfolioThemeContext } from './usePortfolioTheme'

type Filter = 'all' | 'certification' | 'hackathon'

const kindOf = (cert: Certification) => cert.kind ?? 'certification'
const issuerName = (cert: Certification) => cert.issuer.split(' · ')[0]
const pad = (n: number) => String(n).padStart(2, '0')

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'certification', label: 'Certifications' },
  { id: 'hackathon', label: 'Hackathons' },
]

const VISIBLE = 4 // the top card + 3 peeking out behind it
const SWIPE_PX = 80 // how far a drag must go to count as a swipe
const FLY_MS = 260 // how long the top card takes to fly off

// ─── One certificate as a picture ─────────────────────────────────────────────

/** A drawn certificate, for credentials without a picture. */
function PaperCertificate({ cert }: { cert: Certification }) {
  return (
    <span className="pf7-paper" data-kind={kindOf(cert)}>
      <span className="pf7-paper__label">{kindOf(cert) === 'hackathon' ? 'Certificate of participation' : 'Certificate'}</span>
      <span className="pf7-paper__name">{cert.name}</span>
      <span className="pf7-paper__issuer">{issuerName(cert)}</span>
      <span className="pf7-paper__foot">
        <span className="pf7-paper__seal">{cert.mark}</span>
        <span className="pf7-paper__year">{cert.year}</span>
      </span>
    </span>
  )
}

function CertificateImage({ cert, alt = '' }: { cert: Certification; alt?: string }) {
  const [failed, setFailed] = useState(false)
  if (!cert.preview || failed) return <PaperCertificate cert={cert} />
  const [width, height] = cert.previewSize ?? [1200, 900]
  return (
    <img
      src={cert.preview}
      width={width}
      height={height}
      alt={alt}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
    />
  )
}

function CertificateLinks({ cert }: { cert: Certification }) {
  return (
    <span className="pf7-cert__links">
      {cert.url && (
        <a href={cert.url} target="_blank" rel="noreferrer" aria-label={`Verify on ${issuerName(cert)}: ${cert.name}`}>
          <BadgeCheck size={15} aria-hidden="true" /> Verify ↗
        </a>
      )}
      {cert.file && (
        <a href={cert.file} target="_blank" rel="noreferrer" aria-label={`Open the original certificate: ${cert.name}`}>
          <FileText size={15} aria-hidden="true" /> Original ↗
        </a>
      )}
    </span>
  )
}

// ─── Full-size view ───────────────────────────────────────────────────────────

interface LightboxProps {
  cert: Certification
  position: string
  onClose: () => void
  onMove: (step: 1 | -1) => void
}

function Lightbox({ cert, position, onClose, onMove }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <dialog
      ref={ref}
      className="pf7-lightbox"
      aria-label={cert.name}
      onClose={onClose}
      // A click on the dark backdrop lands on the <dialog> itself.
      onClick={e => {
        if (e.target === e.currentTarget) ref.current?.close()
      }}
      onKeyDown={e => {
        if (e.key === 'ArrowRight') onMove(1)
        if (e.key === 'ArrowLeft') onMove(-1)
      }}
    >
      <div className="pf7-lightbox__panel">
        <div className="pf7-lightbox__head">
          <div style={{ minWidth: 0 }}>
            <p className="pf7-cert__name">{cert.name}</p>
            <p className="pf7-cert__meta">{cert.issuer} · {cert.year}</p>
          </div>
          <button type="button" className="pf5-iconbtn" aria-label="Close" onClick={() => ref.current?.close()}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="pf7-lightbox__img">
          <CertificateImage key={cert.name} cert={cert} alt={`Certificate: ${cert.name}, ${cert.issuer}, ${cert.year}`} />
        </div>
        <div className="pf7-lightbox__foot">
          <CertificateLinks cert={cert} />
          <span className="pf7-lightbox__nav">
            <button type="button" className="pf5-iconbtn" aria-label="Previous certificate" onClick={() => onMove(-1)}>
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <span className="pf6-c-muted mono" style={{ fontSize: 12.5 }}>{position}</span>
            <button type="button" className="pf5-iconbtn" aria-label="Next certificate" onClick={() => onMove(1)}>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </span>
        </div>
      </div>
    </dialog>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function CredentialsSection() {
  const { reduceMotion } = usePortfolioThemeContext()
  const [filter, setFilter] = useState<Filter>('all')
  const [index, setIndex] = useState(0)
  const [drag, setDrag] = useState<{ dx: number; dy: number } | null>(null)
  const [flying, setFlying] = useState(false) // top card is leaving to the left
  const [entering, setEntering] = useState<string | null>(null) // card coming back on top
  const [zoomed, setZoomed] = useState(false)
  const start = useRef<{ x: number; y: number } | null>(null)
  const busy = useRef(false)

  const shown = useMemo(
    () => (filter === 'all' ? certifications : certifications.filter(cert => kindOf(cert) === filter)),
    [filter],
  )
  const n = shown.length
  const current = shown[index % Math.max(n, 1)]

  /** One step forward (top card flies off to the back) or back. */
  const go = useCallback((step: 1 | -1) => {
    if (n < 2 || busy.current) return
    if (step === 1) {
      if (reduceMotion) {
        setIndex(i => (i + 1) % n)
        return
      }
      busy.current = true
      setFlying(true)
      window.setTimeout(() => {
        setFlying(false)
        setIndex(i => (i + 1) % n)
        busy.current = false
      }, FLY_MS)
    } else {
      const previous = (index - 1 + n) % n
      if (!reduceMotion) setEntering(shown[previous].name)
      setIndex(previous)
    }
  }, [n, index, shown, reduceMotion])

  const jump = (target: number) => {
    if (target === index) return
    if (!reduceMotion) setEntering(shown[target].name)
    setIndex(target)
  }

  const changeFilter = (next: Filter) => {
    setFilter(next)
    setIndex(0)
    setEntering(null)
  }

  // ── Dragging the top card ──
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (busy.current) return
    start.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({ dx: 0, dy: 0 })
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!start.current) return
    setDrag({ dx: e.clientX - start.current.x, dy: e.clientY - start.current.y })
  }
  const onPointerUp = () => {
    if (!start.current) return
    start.current = null
    const moved = drag ?? { dx: 0, dy: 0 }
    setDrag(null)
    if (Math.abs(moved.dx) < 6 && Math.abs(moved.dy) < 6) setZoomed(true) // a tap
    else if (moved.dx <= -SWIPE_PX) go(1)
    else if (moved.dx >= SWIPE_PX) go(-1)
    // a short drag just springs back
  }
  const onPointerCancel = () => {
    start.current = null
    setDrag(null)
  }

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setZoomed(true) }
  }

  if (!n || !current) return null

  // The visible part of the queue, top card first.
  const queue = Array.from({ length: Math.min(VISIBLE, n) }, (_, k) => shown[(index + k) % n])
  const upNext = queue.slice(1)

  /** Where card k sits in the pile (0 = top). */
  const cardStyle = (cert: Certification, k: number): CSSProperties => {
    const [w, h] = cert.previewSize ?? [4, 3]
    const base = { '--ratio': w / h, zIndex: VISIBLE - k } as CSSProperties
    const center = 'translate(-50%, -50%)'
    if (k === 0 && drag) {
      return { ...base, transform: `${center} translate(${drag.dx}px, ${drag.dy * 0.15}px) rotate(${drag.dx * 0.05}deg)`, transition: 'none' }
    }
    if (k === 0 && flying) {
      return { ...base, transform: `${center} translate(-125%, 30px) rotate(-14deg)`, opacity: 0 }
    }
    return {
      ...base,
      transform: `${center} translate(${k * 18}px, ${-k * 16}px) rotate(${k * 2.2}deg) scale(${1 - k * 0.05})`,
      opacity: k === VISIBLE - 1 ? 0.55 : 1,
    }
  }

  return (
    <section id="credentials" data-screen-label="Certifications" className="pf5-section pf7-certs">
      <div className="pf5-sectionhead">
        <div>
          <SectionEyebrow section="credentials" />
          <h2 className="pf5-h2">Certificates</h2>
          <p className="pf5-lead">Every certificate as it was issued. Swipe through the pile, or open one full size.</p>
        </div>
        <div role="group" aria-label="Show certificates" className="pf6-segmented">
          {FILTERS.map(f => (
            <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => changeFilter(f.id)}>
              {f.label} <span className="pf7-count">{f.id === 'all' ? certifications.length : certifications.filter(c => kindOf(c) === f.id).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pf7-deck">
        <div className="pf7-deck__stage">
          <div
            className="pf7-deck__pile"
            role="group"
            aria-roledescription="carousel"
            aria-label="Certificates. Arrow keys move through them, Enter opens the top one full size."
            tabIndex={0}
            onKeyDown={onKeyDown}
          >
            {queue.map((cert, k) => (
              <div
                key={cert.name}
                className="pf7-deck__card"
                data-top={k === 0}
                data-entering={k === 0 && entering === cert.name}
                aria-hidden={k !== 0}
                style={cardStyle(cert, k)}
                // Only the "coming back on top" animation clears the flag;
                // other cards' fade-ins end at different times.
                onAnimationEnd={e => {
                  if (e.animationName === 'pf7-deck-in') setEntering(null)
                }}
                {...(k === 0 ? { onPointerDown, onPointerMove, onPointerUp, onPointerCancel } : {})}
              >
                <CertificateImage cert={cert} alt={k === 0 ? `Certificate: ${cert.name}` : ''} />
                {kindOf(cert) === 'hackathon' && <span className="pf7-cert__tag">Hackathon</span>}
              </div>
            ))}
          </div>

          {n > 1 && (
            <div className="pf7-deck__dots" role="group" aria-label="Jump to a certificate">
              {shown.map((cert, i) => (
                <button key={cert.name} type="button" aria-label={cert.name} aria-current={i === index} onClick={() => jump(i)} />
              ))}
            </div>
          )}
        </div>

        <div className="pf7-deck__info">
          <p className="pf7-deck__count">{pad(index + 1)} / {pad(n)}</p>
          <div aria-live="polite" className="pf7-deck__current">
            {kindOf(current) === 'hackathon' && <span className="pf7-deck__kind">Hackathon</span>}
            <h3 className="pf7-deck__title">{current.name}</h3>
            <p className="pf7-cert__meta">{current.issuer} · {current.year}</p>
          </div>
          <CertificateLinks cert={current} />

          <div className="pf7-deck__nav">
            <button type="button" className="pf5-iconbtn" aria-label="Previous certificate" onClick={() => go(-1)} disabled={n < 2}>
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" className="pf5-iconbtn" aria-label="Next certificate" onClick={() => go(1)} disabled={n < 2}>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
            <button type="button" className="pf5-btn pf5-btn--ghost" onClick={() => setZoomed(true)}>
              <Maximize2 size={16} aria-hidden="true" /> Full size
            </button>
          </div>
          <p className="pf7-deck__hint"><Hand size={14} aria-hidden="true" /> Swipe the top card, or use ← →</p>

          {upNext.length > 0 && (
            <div className="pf7-deck__next">
              <p className="pf7-deck__nextlabel">Up next</p>
              <ul>
                {upNext.map(cert => (
                  <li key={cert.name}>
                    <button type="button" onClick={() => jump(shown.indexOf(cert))}>
                      <span className="pf7-deck__thumb" aria-hidden="true">
                        {cert.preview && <img src={cert.preview} alt="" draggable={false} />}
                      </span>
                      <span className="pf7-deck__nexttext">
                        <span>{cert.name}</span>
                        <span className="pf6-c-muted">{issuerName(cert)} · {cert.year}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="pf7-certs__guidebook">
        <GuidebookCard />
      </div>

      {zoomed && (
        <Lightbox
          cert={current}
          position={`${index + 1} / ${n}`}
          onClose={() => setZoomed(false)}
          onMove={step => setIndex(i => (i + step + n) % n)}
        />
      )}
    </section>
  )
}
