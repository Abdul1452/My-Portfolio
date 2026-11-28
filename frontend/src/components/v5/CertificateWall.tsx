/**
 * CertificateWall.tsx — Certificates you can SEE, not a list of links
 *
 * WHY:
 *   A row that says "View ↗" asks the visitor to do work, and most won't.
 *   Here every certificate hangs on the wall as a picture: a recruiter sees
 *   the PRY certificate and the LinkedIn Learning ones while scrolling.
 *
 * HOW IT WORKS:
 *   - Pictures come from `preview` in portfolio.data.ts. PDFs get theirs
 *     from scripts/render-certificate-previews.py. A certificate without a
 *     preview (or whose image fails to load) is drawn as a paper card from
 *     its text, so the wall never shows a broken image.
 *   - The frames tilt toward the mouse with CSS 3D transforms (no Three.js
 *     needed: it's flat paper, and CSS keeps the text crisp). Touch screens
 *     and reduced motion get no tilt.
 *   - CSS columns lay out the mix of portrait and landscape paper like a
 *     gallery wall, without cropping anything.
 *   - Clicking a frame opens it larger in a native <dialog> (focus trap,
 *     Esc to close and the backdrop come with the browser). ← → move
 *     between certificates.
 */

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { BadgeCheck, ChevronLeft, ChevronRight, FileText, X } from 'lucide-react'
import { certifications, type Certification } from '@data/portfolio.data'
import { GuidebookCard } from './Guidebook'
import { SectionEyebrow } from './ui'
import { usePortfolioThemeContext } from './usePortfolioTheme'

type Filter = 'all' | 'certification' | 'hackathon'

const kindOf = (cert: Certification) => cert.kind ?? 'certification'
const issuerName = (cert: Certification) => cert.issuer.split(' · ')[0]

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'certification', label: 'Certifications' },
  { id: 'hackathon', label: 'Hackathons' },
]

// ─── Tilt ─────────────────────────────────────────────────────────────────────
// Writes CSS variables straight onto the element, so moving the mouse
// doesn't re-render React. The CSS turns them into rotateX/rotateY and a
// moving highlight ("glare").

function tiltHandlers(enabled: boolean) {
  if (!enabled) return {}
  return {
    onPointerMove(e: ReactPointerEvent<HTMLElement>) {
      if (e.pointerType !== 'mouse') return
      const el = e.currentTarget
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      el.style.setProperty('--rx', `${((0.5 - py) * 9).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${((px - 0.5) * 11).toFixed(2)}deg`)
      el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`)
      el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`)
    },
    onPointerLeave(e: ReactPointerEvent<HTMLElement>) {
      for (const name of ['--rx', '--ry', '--gx', '--gy']) e.currentTarget.style.removeProperty(name)
    },
  }
}

// ─── One certificate as a picture ─────────────────────────────────────────────

/** A drawn certificate, for credentials that only exist as a web page. */
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

function CertificateImage({ cert, alt = '', eager = false }: { cert: Certification; alt?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  if (!cert.preview || failed) return <PaperCertificate cert={cert} />
  const [width, height] = cert.previewSize ?? [1200, 900]
  return (
    <img
      src={cert.preview}
      width={width}
      height={height}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
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

// ─── Larger view ──────────────────────────────────────────────────────────────

interface LightboxProps {
  list: Certification[]
  index: number
  onClose: () => void
  onMove: (step: number) => void
}

function Lightbox({ list, index, onClose, onMove }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const cert = list[index]

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
          <CertificateImage key={cert.name} cert={cert} alt={`Certificate: ${cert.name}, ${cert.issuer}, ${cert.year}`} eager />
        </div>
        <div className="pf7-lightbox__foot">
          <CertificateLinks cert={cert} />
          {list.length > 1 && (
            <span className="pf7-lightbox__nav">
              <button type="button" className="pf5-iconbtn" aria-label="Previous certificate" onClick={() => onMove(-1)}>
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <span className="pf6-c-muted mono" style={{ fontSize: 12.5 }}>{index + 1} / {list.length}</span>
              <button type="button" className="pf5-iconbtn" aria-label="Next certificate" onClick={() => onMove(1)}>
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </span>
          )}
        </div>
      </div>
    </dialog>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function CredentialsSection() {
  const { reduceMotion } = usePortfolioThemeContext()
  const [filter, setFilter] = useState<Filter>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!certifications.length) return null

  const shown = filter === 'all' ? certifications : certifications.filter(cert => kindOf(cert) === filter)
  const count = (id: Filter) => (id === 'all' ? certifications.length : certifications.filter(c => kindOf(c) === id).length)
  const move = (step: number) => setOpenIndex(i => (i === null ? i : (i + step + shown.length) % shown.length))

  return (
    <section id="credentials" data-screen-label="Certifications" className="pf5-section pf7-certs">
      <div className="pf5-sectionhead">
        <div>
          <SectionEyebrow section="credentials" />
          <h2 className="pf5-h2">Proof, on the wall</h2>
          <p className="pf5-lead">
            Every certificate as it was issued. Click one to see it larger, or check it with the issuer.
          </p>
        </div>
        <div role="group" aria-label="Show certificates" className="pf6-segmented">
          {FILTERS.map(f => (
            <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label} <span className="pf7-count">{count(f.id)}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="pf7-wall">
        {shown.map((cert, i) => (
          <li key={cert.name} style={{ animationDelay: `${Math.min(i, 8) * 0.04}s` }}>
            <figure className="pf7-cert">
              <button
                type="button"
                className="pf7-cert__frame"
                aria-label={`View larger: ${cert.name}`}
                onClick={() => setOpenIndex(i)}
                {...tiltHandlers(!reduceMotion)}
              >
                <span className="pf7-cert__mat">
                  <CertificateImage cert={cert} />
                </span>
                <span className="pf7-cert__glare" aria-hidden="true" />
                {kindOf(cert) === 'hackathon' && <span className="pf7-cert__tag">Hackathon</span>}
              </button>
              <figcaption>
                <span className="pf7-cert__name">{cert.name}</span>
                <span className="pf7-cert__meta">{cert.issuer} · {cert.year}</span>
                <CertificateLinks cert={cert} />
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="pf7-certs__guidebook">
        <GuidebookCard />
      </div>

      {openIndex !== null && shown[openIndex] && (
        <Lightbox list={shown} index={openIndex} onClose={() => setOpenIndex(null)} onMove={move} />
      )}
    </section>
  )
}
