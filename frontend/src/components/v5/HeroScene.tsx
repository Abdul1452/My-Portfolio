/**
 * HeroScene.tsx — The story globe behind the hero cards (Three.js)
 *
 * WHAT IT SHOWS:
 *   The headline as a picture: a dotted globe with an arc drawn from Lagos
 *   (where the story starts, 2021) to Turku (where it is now). The arc
 *   fades from warm to cool, the same two colours as the headline, and a
 *   small light keeps travelling along it.
 *
 * THE MATHS, BRIEFLY:
 *   - latLon() turns latitude/longitude into a point on a unit sphere.
 *   - The arc is a "great circle" (the shortest path over a sphere) found
 *     with slerp, lifted off the surface in the middle so it reads as a
 *     flight path.
 *   - The globe is turned so the point between the two cities faces the
 *     camera: VIEW_YAW spins it around its axis, VIEW_PITCH tips it forward.
 *   - The SVG poster uses the same functions, so the poster (shown first,
 *     and for reduced motion) and the live scene line up exactly.
 *
 * Loading, pausing and cleanup follow three-helpers.ts. It's decorative
 * (aria-hidden): the headline and the cards carry the information.
 */

import { useRef } from 'react'
import {
  createRenderer,
  cssToken,
  disposeAll,
  trackSize,
  useLazyThree,
  visibleLoop,
  type MountScene,
} from './three-helpers'

// ─── Geometry shared by the poster and the live scene ─────────────────────────

type V3 = [number, number, number]
const DEG = Math.PI / 180

const CITIES = [
  { id: 'lagos', label: 'Lagos · 2021', lat: 6.45, lon: 3.39, tone: '--globe-from' },
  { id: 'turku', label: 'Turku · today', lat: 60.45, lon: 22.27, tone: '--globe-to' },
] as const

// The globe is turned so this spot (between the cities) faces the viewer.
const CENTER = { lat: 34, lon: 13 }
const VIEW_YAW = (-90 - CENTER.lon) * DEG
const VIEW_PITCH = CENTER.lat * DEG

/** Latitude/longitude in degrees → point on a sphere of radius r. */
function latLon(lat: number, lon: number, r = 1): V3 {
  const phi = (90 - lat) * DEG
  const theta = (lon + 180) * DEG
  return [-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)]
}

/** Rotate a point the way the live scene does: yaw around Y, then pitch around X. */
function view([x, y, z]: V3, yaw = VIEW_YAW, pitch = VIEW_PITCH): V3 {
  const x1 = x * Math.cos(yaw) + z * Math.sin(yaw)
  const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw)
  return [x1, y * Math.cos(pitch) - z1 * Math.sin(pitch), y * Math.sin(pitch) + z1 * Math.cos(pitch)]
}

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

const FROM = latLon(CITIES[0].lat, CITIES[0].lon)
const TO = latLon(CITIES[1].lat, CITIES[1].lon)
const ARC_ANGLE = Math.acos(dot(FROM, TO))
const ARC_STEPS = 96

/** Point t (0…1) along the great circle from Lagos to Turku, lifted in the middle. */
function arcPoint(t: number): V3 {
  const a = Math.sin((1 - t) * ARC_ANGLE) / Math.sin(ARC_ANGLE)
  const b = Math.sin(t * ARC_ANGLE) / Math.sin(ARC_ANGLE)
  const lift = 1 + 0.24 * Math.sin(Math.PI * t)
  return [(a * FROM[0] + b * TO[0]) * lift, (a * FROM[1] + b * TO[1]) * lift, (a * FROM[2] + b * TO[2]) * lift]
}

/** Great-circle distance, rounded to 100 km, for the caption. */
export const JOURNEY_KM = Math.round((ARC_ANGLE * 6371) / 100) * 100

/** Evenly spread points over a sphere (Fibonacci lattice). */
function sphereDots(count: number): V3[] {
  const golden = Math.PI * (3 - Math.sqrt(5))
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    return [Math.cos(golden * i) * r, y, Math.sin(golden * i) * r] as V3
  })
}

/** Latitude and longitude lines, each as a list of points. */
function graticule(): V3[][] {
  const lines: V3[][] = []
  for (let lat = -60; lat <= 75; lat += 15) {
    lines.push(Array.from({ length: 73 }, (_, i) => latLon(lat, -180 + i * 5)))
  }
  for (let lon = -180; lon < 180; lon += 20) {
    lines.push(Array.from({ length: 37 }, (_, i) => latLon(-90 + i * 5, lon)))
  }
  return lines
}

// ─── Poster (SVG): first paint, reduced motion, no WebGL ──────────────────────

const POSTER = { w: 600, h: 460, cx: 312, cy: 248, r: 172 }

function project(p: V3) {
  const [x, y, z] = view(p)
  return { x: POSTER.cx + x * POSTER.r, y: POSTER.cy - y * POSTER.r, z }
}

/** SVG path through the visible (front-facing) part of a line. */
function frontPath(points: V3[]) {
  let d = ''
  let drawing = false
  for (const point of points) {
    const p = project(point)
    if (p.z > 0) {
      d += `${drawing ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`
      drawing = true
    } else {
      drawing = false
    }
  }
  return d
}

const POSTER_GRID = graticule().map(frontPath).filter(Boolean)
const POSTER_DOTS = sphereDots(900).map(project).filter(p => p.z > 0.05)
const POSTER_ARC = Array.from({ length: ARC_STEPS + 1 }, (_, i) => project(arcPoint(i / ARC_STEPS)))
const POSTER_CITIES = CITIES.map(c => ({ ...c, ...project(latLon(c.lat, c.lon)) }))

function GlobePoster() {
  const { w, h, cx, cy, r } = POSTER
  const arc = POSTER_ARC.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('')
  return (
    <svg className="pf6-scene__poster" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="pf7-globe-fill" cx="38%" cy="32%" r="75%">
          <stop offset="0" style={{ stopColor: 'var(--globe-fill-hi)' }} />
          <stop offset="1" style={{ stopColor: 'var(--globe-fill)' }} />
        </radialGradient>
        <radialGradient id="pf7-globe-glow">
          <stop offset=".72" style={{ stopColor: 'var(--globe-to)', stopOpacity: 0.22 }} />
          <stop offset="1" style={{ stopColor: 'var(--globe-to)', stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id="pf7-arc" x1={POSTER_ARC[0].x} y1={POSTER_ARC[0].y} x2={POSTER_ARC[ARC_STEPS].x} y2={POSTER_ARC[ARC_STEPS].y} gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: 'var(--globe-from)' }} />
          <stop offset="1" style={{ stopColor: 'var(--globe-to)' }} />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r * 1.3} fill="url(#pf7-globe-glow)" />
      <circle cx={cx} cy={cy} r={r} fill="url(#pf7-globe-fill)" />
      {POSTER_GRID.map(d => (
        <path key={d} d={d} fill="none" style={{ stroke: 'var(--globe-line)' }} strokeWidth={0.7} />
      ))}
      {POSTER_DOTS.map(p => (
        <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r={1.15} style={{ fill: 'var(--globe-dot)' }} opacity={0.25 + 0.6 * p.z} />
      ))}
      <path d={arc} fill="none" stroke="url(#pf7-arc)" strokeWidth={3} strokeLinecap="round" />
      {POSTER_CITIES.map(c => (
        <g key={c.id}>
          <circle cx={c.x} cy={c.y} r={11} style={{ fill: `var(${c.tone})` }} opacity={0.2} />
          <circle cx={c.x} cy={c.y} r={4.5} style={{ fill: `var(${c.tone})` }} />
          <text x={c.x + 12} y={c.y + 4} fontSize={12} style={{ fill: 'var(--ink)', fontFamily: 'var(--mono)' }}>{c.label}</text>
        </g>
      ))}
    </svg>
  )
}

// ─── Live scene (Three.js) ────────────────────────────────────────────────────

const mountGlobe: MountScene = (THREE, root, ready) => {
  const renderer = createRenderer(THREE, root, 'pf6-scene__canvas')
  if (!renderer) return () => {} // No WebGL: the poster stays.

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
  camera.position.set(0, 0, 4.9)

  // outer tips the globe forward (pitch); inner spins it (yaw + sway).
  const outer = new THREE.Group()
  const inner = new THREE.Group()
  outer.rotation.x = VIEW_PITCH
  outer.add(inner)
  scene.add(outer)

  const v = (p: V3) => new THREE.Vector3(p[0], p[1], p[2])

  // Soft glow behind the globe: a sprite with a radial-gradient texture.
  const glowCanvas = document.createElement('canvas')
  glowCanvas.width = glowCanvas.height = 256
  const g = glowCanvas.getContext('2d')!
  const gradient = g.createRadialGradient(128, 128, 60, 128, 128, 128)
  gradient.addColorStop(0, 'rgba(255,255,255,0.55)')
  gradient.addColorStop(0.55, 'rgba(255,255,255,0.18)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = gradient
  g.fillRect(0, 0, 256, 256)
  const glowMat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(glowCanvas), transparent: true, depthWrite: false })
  const glow = new THREE.Sprite(glowMat)
  glow.scale.setScalar(3.1)
  outer.add(glow)

  // Solid body, so dots on the far side are hidden.
  const bodyMat = new THREE.MeshBasicMaterial()
  inner.add(new THREE.Mesh(new THREE.SphereGeometry(0.995, 64, 48), bodyMat))

  // Graticule.
  const gridPositions: number[] = []
  for (const line of graticule()) {
    for (let i = 1; i < line.length; i++) gridPositions.push(...line[i - 1], ...line[i])
  }
  const gridGeometry = new THREE.BufferGeometry()
  gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3))
  const gridMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.5 })
  inner.add(new THREE.LineSegments(gridGeometry, gridMat))

  // Dotted surface.
  const dotGeometry = new THREE.BufferGeometry()
  dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(sphereDots(1800).flatMap(p => p.map(n => n * 1.002)), 3))
  const dotMat = new THREE.PointsMaterial({ size: 0.014, transparent: true, opacity: 0.75, depthWrite: false })
  inner.add(new THREE.Points(dotGeometry, dotMat))

  // The journey arc: a tube, coloured from warm (Lagos) to cool (Turku).
  const curve = new THREE.CatmullRomCurve3(Array.from({ length: ARC_STEPS + 1 }, (_, i) => v(arcPoint(i / ARC_STEPS))))
  const RADIAL = 8
  const arcGeometry = new THREE.TubeGeometry(curve, ARC_STEPS, 0.011, RADIAL, false)
  const arcColors = new Float32Array(arcGeometry.attributes.position.count * 3)
  arcGeometry.setAttribute('color', new THREE.BufferAttribute(arcColors, 3))
  const arcMat = new THREE.MeshBasicMaterial({ vertexColors: true })
  inner.add(new THREE.Mesh(arcGeometry, arcMat))
  const arcIndexCount = arcGeometry.index ? arcGeometry.index.count : 0
  arcGeometry.setDrawRange(0, 0)

  // A small light that keeps travelling the route.
  const cometMat = new THREE.MeshBasicMaterial()
  const comet = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), cometMat)
  inner.add(comet)

  // City markers: a dot and a ring that pulses outwards.
  const markers = CITIES.map(city => {
    const position = v(latLon(city.lat, city.lon, 1.004))
    const dotMesh = new THREE.Mesh(new THREE.SphereGeometry(0.028, 16, 12), new THREE.MeshBasicMaterial())
    dotMesh.position.copy(position)
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.04, 0.052, 40),
      new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false }),
    )
    ring.position.copy(position)
    ring.lookAt(position.clone().multiplyScalar(2)) // face outwards
    inner.add(dotMesh, ring)
    return { city, position, dotMesh, ring }
  })

  // HTML labels follow the markers (crisp text, themed by CSS).
  const labelsHost = root.querySelector<HTMLElement>('.pf6-scene__labels')
  const labels = CITIES.map(city => {
    const el = document.createElement('span')
    el.className = 'pf6-scene__label pf7-globe__label'
    el.textContent = city.label
    labelsHost?.appendChild(el)
    return el
  })

  // Colours come from CSS tokens, so the scene follows the theme.
  const recolor = () => {
    const from = new THREE.Color(cssToken(root, '--globe-from'))
    const to = new THREE.Color(cssToken(root, '--globe-to'))
    bodyMat.color.set(cssToken(root, '--globe-fill'))
    gridMat.color.set(cssToken(root, '--globe-line'))
    dotMat.color.set(cssToken(root, '--globe-dot'))
    glowMat.color.set(to)
    cometMat.color.set(cssToken(root, '--scene-core')) // near-white in dark, near-black in light
    const mix = new THREE.Color()
    for (let i = 0; i <= ARC_STEPS; i++) {
      mix.copy(from).lerp(to, i / ARC_STEPS)
      for (let j = 0; j <= RADIAL; j++) mix.toArray(arcColors, (i * (RADIAL + 1) + j) * 3)
    }
    arcGeometry.attributes.color.needsUpdate = true
    markers.forEach(({ city, dotMesh, ring }) => {
      const color = cssToken(root, city.tone)
      ;(dotMesh.material as InstanceType<typeof THREE.MeshBasicMaterial>).color.set(color)
      ;(ring.material as InstanceType<typeof THREE.MeshBasicMaterial>).color.set(color)
    })
  }
  recolor()
  const themeHost = root.closest('[data-theme]')
  const themeObserver = new MutationObserver(recolor)
  if (themeHost) themeObserver.observe(themeHost, { attributes: true, attributeFilter: ['data-theme'] })

  const { size, stop: stopSize } = trackSize(root, renderer, camera)

  // Gentle tilt toward the pointer.
  let targetX = 0, targetY = 0, tiltX = 0, tiltY = 0
  const onPointer = (e: PointerEvent) => {
    const rect = root.getBoundingClientRect()
    targetY = ((e.clientX - rect.left) / rect.width - 0.5) * 0.35
    targetX = ((e.clientY - rect.top) / rect.height - 0.5) * 0.2
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  const DRAW_MS = 2200 // the arc draws itself once, then the comet loops
  const LOOP_MS = 4200
  let elapsed = 0
  let announced = false
  const world = new THREE.Vector3()

  const stopLoop = visibleLoop(root, dt => {
    elapsed += dt
    tiltX += (targetX - tiltX) * 0.05
    tiltY += (targetY - tiltY) * 0.05

    // Sway around the start angle instead of spinning, so both cities stay in view.
    inner.rotation.y = VIEW_YAW + Math.sin(elapsed * 0.00022) * 0.28 + tiltY
    outer.rotation.x = VIEW_PITCH + tiltX
    // Nudged down a little: the name chip sits in the top-left corner.
    outer.position.set(0.08, -0.1, 0)

    const drawn = Math.min(1, elapsed / DRAW_MS)
    const eased = 1 - Math.pow(1 - drawn, 3)
    arcGeometry.setDrawRange(0, Math.floor((arcIndexCount / 6) * eased) * 6)

    const t = drawn < 1 ? eased : ((elapsed - DRAW_MS) % LOOP_MS) / LOOP_MS
    // getPointAt only accepts 0…1; anything else reads past the curve's points.
    comet.position.copy(curve.getPointAt(Math.min(1, Math.max(0, t))))
    comet.visible = drawn < 1 || t < 0.98

    const pulse = (elapsed % 2000) / 2000
    markers.forEach(({ ring }, i) => {
      const p = (pulse + i * 0.5) % 1
      ring.scale.setScalar(1 + p * 1.8)
      ;(ring.material as InstanceType<typeof THREE.MeshBasicMaterial>).opacity = 0.7 * (1 - p)
    })

    scene.updateMatrixWorld()
    renderer.render(scene, camera)

    markers.forEach(({ dotMesh }, i) => {
      dotMesh.getWorldPosition(world)
      const facing = world.z - outer.position.z // > 0: on the side facing us
      world.project(camera)
      const x = (world.x * 0.5 + 0.5) * size.width
      const y = (-world.y * 0.5 + 0.5) * size.height
      labels[i].style.transform = `translate(${x + 12}px, ${y - 8}px)`
      labels[i].style.opacity = facing > 0.15 ? '1' : '0'
    })

    if (!announced) {
      announced = true
      ready()
    }
  })

  return () => {
    stopLoop()
    stopSize()
    themeObserver.disconnect()
    window.removeEventListener('pointermove', onPointer)
    labels.forEach(el => el.remove())
    disposeAll(scene, renderer)
  }
}

export function HeroScene({ reduceMotion }: { reduceMotion: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const ready = useLazyThree(rootRef, mountGlobe, !reduceMotion)

  return (
    <div ref={rootRef} className="pf6-scene pf7-globe" data-ready={ready} aria-hidden="true">
      <GlobePoster />
      <div className="pf6-scene__labels" />
      <div className="pf6-scene__legend pf7-globe__legend">
        <i style={{ background: 'var(--globe-from)' }} /> Lagos
        <span className="pf7-globe__route" />
        <i style={{ background: 'var(--globe-to)' }} /> Turku
        <span className="pf6-c-muted">≈ {JOURNEY_KM.toLocaleString('en-US')} km</span>
      </div>
    </div>
  )
}
