/**
 * BookShelf.tsx — "On my desk": the books I'm reading, in 3D (Three.js)
 *
 * WHAT YOU SEE:
 *   The selected book stands on the desk, slowly breathing. Drag it to
 *   turn it (it has momentum, then settles on its front or back cover);
 *   "Flip" turns it round to read the back. With more than one book in
 *   portfolio.data.ts → books, the others stand beside it showing their
 *   spines, and the tabs slide the shelf along.
 *
 * HOW THE BOOK IS BUILT:
 *   Four boxes: front board, back board, spine and the block of pages, so
 *   the covers overhang the pages like a real hardback. The cover, spine
 *   and back are drawn on <canvas> elements from the book's title, author
 *   and colours (no cover images to download or license), then used as
 *   textures. They're redrawn once the web fonts have loaded.
 *
 * ACCESSIBILITY:
 *   The canvas is decorative (aria-hidden); every fact is in the text
 *   beside it. Dragging is optional: the Flip button does the same job.
 *   Vertical swipes still scroll the page on phones (touch-action: pan-y).
 *   Reduced motion → a still CSS book instead of WebGL.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MutableRefObject } from 'react'
import { ExternalLink, Hand, Repeat2 } from 'lucide-react'
import { books, type Book } from '@data/portfolio.data'
import {
  createRenderer,
  disposeAll,
  trackSize,
  useLazyThree,
  visibleLoop,
  type MountScene,
  type ThreeModule,
} from './three-helpers'
import { SectionEyebrow } from './ui'
import { usePortfolioThemeContext } from './usePortfolioTheme'

const STATUS_LABEL: Record<Book['status'], string> = {
  reading: 'Reading now',
  rereading: 'Reading again',
  read: 'Read',
}

// Book size in scene units (a 7 × 9.2 inch hardback, ~600 pages).
const W = 1.4
const H = 1.84
const D = 0.32
const BOARD = 0.028 // cover board thickness
const SPACING = 2.1 // distance between books on the shelf
const PX = 760 // canvas pixels per scene unit

const SERIF = '"Instrument Serif", Georgia, serif'
const SANS = 'Onest, system-ui, sans-serif'
const MONO = '"JetBrains Mono", ui-monospace, monospace'

// ─── Drawing the covers on canvas ─────────────────────────────────────────────

function canvas(width: number, height: number) {
  const el = document.createElement('canvas')
  el.width = Math.round(width)
  el.height = Math.round(height)
  return { el, ctx: el.getContext('2d')! }
}

/** Split text into lines that fit maxWidth at the current font. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function alpha(hex: string, a: number) {
  const n = parseInt(hex.replace('#', ''), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

function drawFront(ctx: CanvasRenderingContext2D, book: Book, w: number, h: number) {
  const { bg, ink, accent } = book.cover
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // A light sheen, as if the cover catches the light.
  const sheen = ctx.createLinearGradient(0, 0, w, h)
  sheen.addColorStop(0, 'rgba(255,255,255,0.10)')
  sheen.addColorStop(0.5, 'rgba(255,255,255,0)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, w, h)

  // Motif: streams of data flowing across, with nodes where they meet.
  const top = h * 0.08
  const band = h * 0.42
  for (let i = 0; i < 16; i++) {
    const y0 = top + (i / 15) * band
    ctx.beginPath()
    for (let x = 0; x <= w; x += 8) {
      const y = y0 + Math.sin(x / 90 + i * 0.7) * 14 + Math.sin(x / 31 + i) * 3
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.strokeStyle = alpha(accent, 0.12 + (i % 4 === 0 ? 0.28 : 0.06))
    ctx.lineWidth = i % 4 === 0 ? 2.4 : 1.2
    ctx.stroke()
  }
  for (let i = 0; i < 9; i++) {
    const x = w * (0.12 + ((i * 37) % 76) / 100)
    const y = top + band * (((i * 53) % 90) / 100)
    ctx.beginPath()
    ctx.arc(x, y, i % 3 === 0 ? 9 : 5, 0, Math.PI * 2)
    ctx.fillStyle = alpha(accent, i % 3 === 0 ? 0.9 : 0.5)
    ctx.fill()
  }

  const left = w * 0.09
  const maxWidth = w * 0.82
  let y = h * 0.58
  ctx.fillStyle = accent
  ctx.fillRect(left, y - 34, w * 0.14, 7)

  ctx.fillStyle = ink
  ctx.textBaseline = 'alphabetic'
  ctx.font = `400 ${Math.round(w * 0.105)}px ${SERIF}`
  for (const line of wrap(ctx, book.title, maxWidth)) {
    y += w * 0.105
    ctx.fillText(line, left, y)
  }
  if (book.subtitle) {
    y += w * 0.05
    ctx.font = `400 ${Math.round(w * 0.032)}px ${SANS}`
    ctx.fillStyle = alpha(ink, 0.72)
    for (const line of wrap(ctx, book.subtitle, maxWidth * 0.9)) {
      y += w * 0.045
      ctx.fillText(line, left, y)
    }
  }

  ctx.fillStyle = ink
  ctx.font = `600 ${Math.round(w * 0.04)}px ${SANS}`
  ctx.fillText(book.author, left, h * 0.93)
  ctx.font = `400 ${Math.round(w * 0.024)}px ${MONO}`
  ctx.fillStyle = alpha(ink, 0.6)
  const pub = `${book.publisher} · ${book.year}`
  ctx.fillText(pub, w - left - ctx.measureText(pub).width, h * 0.93)
}

function drawSpine(ctx: CanvasRenderingContext2D, book: Book, w: number, h: number) {
  const { bg, ink, accent } = book.cover
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  const shade = ctx.createLinearGradient(0, 0, w, 0)
  shade.addColorStop(0, 'rgba(0,0,0,0.25)')
  shade.addColorStop(0.3, 'rgba(255,255,255,0.06)')
  shade.addColorStop(1, 'rgba(0,0,0,0.2)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = accent
  ctx.fillRect(0, h * 0.06, w, 6)
  ctx.fillRect(0, h * 0.94, w, 6)

  // English spines read top to bottom: turn the canvas 90° clockwise.
  ctx.save()
  ctx.translate(w / 2, 0)
  ctx.rotate(Math.PI / 2)
  ctx.fillStyle = ink
  ctx.textBaseline = 'middle'
  let size = Math.round(w * 0.36)
  ctx.font = `400 ${size}px ${SERIF}`
  while (ctx.measureText(book.title).width > h * 0.62 && size > 12) {
    size -= 2
    ctx.font = `400 ${size}px ${SERIF}`
  }
  ctx.fillText(book.title, h * 0.1, 0)
  ctx.font = `600 ${Math.round(w * 0.17)}px ${SANS}`
  const surname = book.author.split(' ').slice(-1)[0].toUpperCase()
  ctx.fillText(surname, h * 0.9 - ctx.measureText(surname).width, 0)
  ctx.restore()
}

function drawBack(ctx: CanvasRenderingContext2D, book: Book, w: number, h: number) {
  const { bg, ink, accent } = book.cover
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  const left = w * 0.1
  let y = h * 0.14
  ctx.fillStyle = accent
  ctx.font = `600 ${Math.round(w * 0.026)}px ${MONO}`
  ctx.fillText('INSIDE', left, y)
  ctx.fillStyle = ink
  ctx.font = `400 ${Math.round(w * 0.06)}px ${SERIF}`
  for (const topic of book.topics) {
    y += w * 0.085
    ctx.fillText(topic, left, y)
  }
  // A barcode, because every book has one.
  const bx = w - left - w * 0.28
  const by = h * 0.82
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(bx, by, w * 0.28, h * 0.1)
  ctx.fillStyle = '#111111'
  for (let i = 0, x = bx + 14; x < bx + w * 0.28 - 14; i++) {
    const bar = 2 + ((i * 7) % 5)
    ctx.fillRect(x, by + 12, bar, h * 0.1 - 24)
    x += bar + 3 + ((i * 3) % 4)
  }
}

function drawPages(ctx: CanvasRenderingContext2D, w: number, h: number, vertical: boolean) {
  ctx.fillStyle = '#efe8da'
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < (vertical ? w : h); i += 3) {
    ctx.fillStyle = `rgba(120, 100, 70, ${0.06 + ((i * 13) % 7) / 100})`
    if (vertical) ctx.fillRect(i, 0, 1, h)
    else ctx.fillRect(0, i, w, 1)
  }
}

// ─── Building one book ────────────────────────────────────────────────────────

function buildBook(THREE: ThreeModule, book: Book) {
  const textures: InstanceType<ThreeModule['CanvasTexture']>[] = []
  const draws: (() => void)[] = []

  const texture = (width: number, height: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) => {
    const { el, ctx } = canvas(width, height)
    const tex = new THREE.CanvasTexture(el)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    const redraw = () => {
      ctx.clearRect(0, 0, el.width, el.height)
      draw(ctx, el.width, el.height)
      tex.needsUpdate = true
    }
    redraw()
    draws.push(redraw)
    textures.push(tex)
    return tex
  }

  const board = new THREE.MeshStandardMaterial({ color: book.cover.bg, roughness: 0.55 })
  const front = new THREE.MeshStandardMaterial({ map: texture(W * PX, H * PX, (c, w, h) => drawFront(c, book, w, h)), roughness: 0.5 })
  const back = new THREE.MeshStandardMaterial({ map: texture(W * PX, H * PX, (c, w, h) => drawBack(c, book, w, h)), roughness: 0.55 })
  const spine = new THREE.MeshStandardMaterial({ map: texture(D * PX, H * PX, (c, w, h) => drawSpine(c, book, w, h)), roughness: 0.5 })
  const pagesSide = new THREE.MeshStandardMaterial({ map: texture(256, 512, (c, w, h) => drawPages(c, w, h, true)), roughness: 0.9 })
  const pagesTop = new THREE.MeshStandardMaterial({ map: texture(512, 128, (c, w, h) => drawPages(c, w, h, false)), roughness: 0.9 })

  const group = new THREE.Group()
  // Box faces are ordered +x, −x, +y, −y, +z, −z.
  const frontBoard = new THREE.Mesh(new THREE.BoxGeometry(W, H, BOARD), [board, board, board, board, front, board])
  frontBoard.position.z = D / 2 - BOARD / 2
  const backBoard = new THREE.Mesh(new THREE.BoxGeometry(W, H, BOARD), [board, board, board, board, board, back])
  backBoard.position.z = -D / 2 + BOARD / 2
  const spineBox = new THREE.Mesh(new THREE.BoxGeometry(BOARD, H, D), [board, spine, board, board, board, board])
  spineBox.position.x = -W / 2 + BOARD / 2
  const pages = new THREE.Mesh(
    new THREE.BoxGeometry(W - BOARD - 0.03, H - 0.05, D - BOARD * 2),
    [pagesSide, pagesSide, pagesTop, pagesTop, pagesSide, pagesSide],
  )
  pages.position.x = BOARD / 2 - 0.015
  group.add(frontBoard, backBoard, spineBox, pages)

  return { group, redraw: () => draws.forEach(d => d()), textures }
}

// ─── Scene ────────────────────────────────────────────────────────────────────

export interface BookControl {
  select(index: number): void
  flip(): void
}

// Turning by +0.42 rad (~24°) brings the spine (the −x face) toward the
// camera, so you see the front cover and the spine with its title.
const REST_YAW = 0.42
const SPINE_YAW = Math.PI / 2 // other books face us spine-first

function mountShelf(THREE: ThreeModule, root: HTMLDivElement, ready: () => void, control: MutableRefObject<BookControl | null>) {
  const renderer = createRenderer(THREE, root, 'pf7-reading__canvas')
  if (!renderer) return () => {}

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
  camera.position.set(0, 0.3, 5.1)
  camera.lookAt(0, 0, 0)

  scene.add(new THREE.HemisphereLight(0xfff4e6, 0x20242c, 1.25))
  const key = new THREE.DirectionalLight(0xffffff, 2.1)
  key.position.set(3, 4, 5)
  const rim = new THREE.DirectionalLight(0x9db4ff, 1.4)
  rim.position.set(-4, 2, -3)
  scene.add(key, rim)

  const shelf = new THREE.Group()
  scene.add(shelf)

  // A soft shadow on the desk under each book (radial gradient, no shadow maps).
  const { el: shadowCanvas, ctx: s } = canvas(256, 256)
  const gradient = s.createRadialGradient(128, 128, 10, 128, 128, 128)
  gradient.addColorStop(0, 'rgba(0,0,0,0.5)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  s.fillStyle = gradient
  s.fillRect(0, 0, 256, 256)
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas)

  const items = books.map((book, i) => {
    const built = buildBook(THREE, book)
    built.group.position.x = i * SPACING
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 1.1),
      new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.set(i * SPACING, -H / 2 - 0.08, 0)
    shelf.add(built.group, shadow)
    return { ...built, shadow, yaw: i === 0 ? REST_YAW : SPINE_YAW, scale: i === 0 ? 1 : 0.82 }
  })

  // Covers use the web fonts; redraw once they've arrived.
  document.fonts?.ready.then(() => items.forEach(item => item.redraw())).catch(() => {})

  const { stop: stopSize } = trackSize(root, renderer, camera)

  // ── Interaction state ──
  let selected = 0
  let target = REST_YAW // where the selected book settles
  let velocity = 0
  let dragging = false
  let lastX = 0
  let sinceRelease = 0

  /** Nearest resting angle (front or back cover) to the current yaw. */
  const settle = (yaw: number) => REST_YAW + Math.round((yaw - REST_YAW) / Math.PI) * Math.PI

  control.current = {
    select(index) {
      if (index === selected || !items[index]) return
      selected = index
      target = REST_YAW
      items[selected].yaw = REST_YAW + Math.PI * 0.6 // swing in
      velocity = 0
      sinceRelease = 2000
    },
    flip() {
      target = settle(items[selected].yaw) + Math.PI
      velocity = 0
      sinceRelease = 2000
    },
  }

  const canvasEl = renderer.domElement
  const onDown = (e: PointerEvent) => {
    dragging = true
    lastX = e.clientX
    velocity = 0
    canvasEl.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent) => {
    if (!dragging) return
    const dx = (e.clientX - lastX) * 0.012
    lastX = e.clientX
    items[selected].yaw += dx
    velocity = dx
  }
  const onUp = (e: PointerEvent) => {
    if (!dragging) return
    dragging = false
    sinceRelease = 0
    if (canvasEl.hasPointerCapture(e.pointerId)) canvasEl.releasePointerCapture(e.pointerId)
  }
  canvasEl.addEventListener('pointerdown', onDown)
  canvasEl.addEventListener('pointermove', onMove)
  canvasEl.addEventListener('pointerup', onUp)
  canvasEl.addEventListener('pointercancel', onUp)

  let elapsed = 0
  let announced = false

  const stopLoop = visibleLoop(root, dt => {
    elapsed += dt
    const k = Math.min(1, dt / 16.7) // frame-rate independent easing

    // Slide the shelf so the selected book is centred.
    shelf.position.x += (-selected * SPACING - shelf.position.x) * 0.08 * k

    items.forEach((item, i) => {
      const isSelected = i === selected
      if (isSelected) {
        if (!dragging) {
          // Momentum first, then ease to the nearest cover (or the flip target).
          item.yaw += velocity * k
          velocity *= Math.pow(0.93, k)
          sinceRelease += dt
          if (Math.abs(velocity) < 0.002 && sinceRelease > 350) {
            if (sinceRelease < 2000) target = settle(item.yaw)
            item.yaw += (target - item.yaw) * 0.07 * k
          }
        }
      } else {
        item.yaw += (SPINE_YAW - item.yaw) * 0.08 * k
      }
      item.scale += ((isSelected ? 1 : 0.82) - item.scale) * 0.1 * k

      // Idle "breathing": the selected book floats a little.
      const float = isSelected ? Math.sin(elapsed * 0.0016) * 0.045 + 0.05 : 0
      item.group.rotation.set(isSelected ? Math.sin(elapsed * 0.0011) * 0.03 : 0, item.yaw, 0)
      item.group.position.y = float - (1 - item.scale) * H * 0.5
      item.group.scale.setScalar(item.scale)
      item.shadow.scale.setScalar(item.scale * (1 - float * 1.5))
      ;(item.shadow.material as InstanceType<ThreeModule['MeshBasicMaterial']>).opacity = 0.9 - float * 3
    })

    renderer.render(scene, camera)
    if (!announced) {
      announced = true
      ready()
    }
  })

  return () => {
    stopLoop()
    stopSize()
    control.current = null
    canvasEl.removeEventListener('pointerdown', onDown)
    canvasEl.removeEventListener('pointermove', onMove)
    canvasEl.removeEventListener('pointerup', onUp)
    canvasEl.removeEventListener('pointercancel', onUp)
    shadowTexture.dispose()
    items.forEach(item => item.textures.forEach(t => t.dispose()))
    disposeAll(scene, renderer)
  }
}

// ─── Still book (poster): first paint, reduced motion, no WebGL ───────────────

function BookPoster({ book }: { book: Book }) {
  const style = { '--book-bg': book.cover.bg, '--book-ink': book.cover.ink, '--book-accent': book.cover.accent } as CSSProperties
  return (
    <div className="pf7-bookposter" style={style} aria-hidden="true">
      <div className="pf7-bookposter__book">
        <div className="pf7-bookposter__front">
          <span className="pf7-bookposter__rule" />
          <span className="pf7-bookposter__title">{book.title}</span>
          <span className="pf7-bookposter__author">{book.author}</span>
        </div>
        <div className="pf7-bookposter__spine" />
      </div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function ReadingSection() {
  const { reduceMotion } = usePortfolioThemeContext()
  const [index, setIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const control = useRef<BookControl | null>(null)

  const mount = useCallback<MountScene>((THREE, root, ready) => mountShelf(THREE, root, ready, control), [])
  const ready = useLazyThree(rootRef, mount, !reduceMotion && books.length > 0)

  useEffect(() => {
    control.current?.select(index)
  }, [index, ready])

  if (!books.length) return null
  const book = books[index]

  return (
    <section id="reading" data-screen-label="Reading" className="pf5-section pf7-reading">
      <div ref={rootRef} className="pf7-reading__stage" data-ready={ready}>
        <BookPoster book={book} />
        {ready && (
          <p className="pf7-reading__hint" aria-hidden="true">
            <Hand size={14} /> Drag to turn it
          </p>
        )}
      </div>

      <div className="pf7-reading__text">
        <SectionEyebrow section="reading" />
        <h2 className="pf5-h2">On my desk</h2>
        <p className="pf5-lead" style={{ marginBottom: 24 }}>
          The books shaping how I think about building software.
        </p>

        {books.length > 1 && (
          <div role="group" aria-label="Choose a book" className="pf6-segmented pf7-reading__tabs">
            {books.map((b, i) => (
              <button key={b.id} type="button" aria-pressed={i === index} onClick={() => setIndex(i)}>
                {b.title.length > 26 ? `${b.title.slice(0, 24)}…` : b.title}
              </button>
            ))}
          </div>
        )}

        <article className="pf7-book" aria-live="polite">
          <span className="pf7-book__status" data-status={book.status}>{STATUS_LABEL[book.status]}</span>
          <h3 className="pf7-book__title">{book.title}</h3>
          <p className="pf7-book__by">
            {book.author} · {book.publisher} · {book.year}
          </p>
          <blockquote className="pf7-book__note">{book.note}</blockquote>
          <ul className="pf6-pills" aria-label="Topics">
            {book.topics.map(topic => <li key={topic} className="pf6-pill">{topic}</li>)}
          </ul>
          <div className="pf5-actions" style={{ marginTop: 20 }}>
            {ready && (
              <button type="button" className="pf5-btn pf5-btn--ghost" onClick={() => control.current?.flip()}>
                <Repeat2 size={18} aria-hidden="true" /> Flip the book
              </button>
            )}
            {book.url && (
              <a href={book.url} target="_blank" rel="noreferrer" className="pf5-btn pf5-btn--ghost">
                About the book <ExternalLink size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
