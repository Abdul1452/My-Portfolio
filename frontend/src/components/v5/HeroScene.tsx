/**
 * HeroScene.tsx — The "stack constellation" behind the hero cards (Three.js)
 *
 * WHAT IT SHOWS:
 *   You at the centre, with three orbits around you: the stack you ship
 *   with (blue), the projects on this page (amber) and the project
 *   management skills (green). It's the T-shape in one picture: backend
 *   depth plus PM breadth.
 *
 * HOW IT STAYS CHEAP:
 *   1. A static SVG poster of the same layout renders immediately.
 *   2. Three.js is only downloaded (dynamic import) once the hero is close
 *      to the viewport, so it never delays the first paint.
 *   3. The animation loop stops when the hero scrolls out of view or the
 *      tab is hidden, and everything is disposed on unmount.
 *   4. Reduced motion or no WebGL → the poster simply stays.
 *
 * It's decorative (aria-hidden): the cards on top carry the information.
 */

import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import { featuredProjects } from '@data/portfolio.data'
import type { PortfolioTheme } from './usePortfolioTheme'

type ThreeModule = typeof import('three')
type Kind = 'stack' | 'project' | 'pm'

interface SceneNode { label: string; kind: Kind; x: number; y: number; z: number }

// Labels come from portfolio.data.ts where they can (project titles), and
// otherwise from the "shipped" skills it lists.
const STACK = ['Node.js', 'TypeScript', 'PostgreSQL', 'Python', 'Docker', 'React', 'Prisma', 'AWS Lambda']
const PM = ['Scrum', 'WBS & PBS', 'Risk registers']
const PROJECTS = featuredProjects.map(p => p.title.replace(/^Serverless /, ''))

/** Spread labels evenly around a tilted ring. */
function ring(labels: string[], kind: Kind, radius: number, tilt: number, phase: number): SceneNode[] {
  return labels.map((label, i) => {
    const a = phase + (i / labels.length) * Math.PI * 2
    return { label, kind, x: radius * Math.cos(a), y: radius * Math.sin(a) * tilt, z: radius * Math.sin(a) }
  })
}

const NODES: SceneNode[] = [
  ...ring(STACK, 'stack', 1.6, 0.32, 0.3),
  ...ring(PROJECTS, 'project', 0.95, -0.3, 1.1),
  ...ring(PM, 'pm', 1.25, 0.55, 2.4),
]

const KIND_VAR: Record<Kind, string> = { stack: '--scene-stack', project: '--scene-project', pm: '--scene-pm' }
const KINDS: Kind[] = ['stack', 'project', 'pm']

/** 0 (far) … 1 (near) */
const nearness = (z: number) => (z / 1.6 + 1) / 2

// ─── Poster (SVG) ─────────────────────────────────────────────────────────────

function ScenePoster() {
  const cx = 340, cy = 220, scale = 150
  const points = NODES
    .map(n => ({ ...n, sx: cx + n.x * scale, sy: cy + (-n.y + n.z * 0.3) * scale, t: nearness(n.z) }))
    .sort((a, b) => a.t - b.t)

  return (
    <svg className="pf6-scene__poster" viewBox="0 0 600 440" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="pf6-core-glow">
          <stop offset="0" style={{ stopColor: 'var(--scene-stack)', stopOpacity: 0.35 }} />
          <stop offset="1" style={{ stopColor: 'var(--scene-stack)', stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={130} fill="url(#pf6-core-glow)" />
      {points.map(n => (
        <line key={`edge-${n.label}`} x1={cx} y1={cy} x2={n.sx} y2={n.sy} style={{ stroke: `var(${KIND_VAR[n.kind]})` }} strokeOpacity={0.12 + 0.15 * n.t} />
      ))}
      {points.map(n => {
        const r = (n.kind === 'project' ? 7 : 4.5) * (0.75 + 0.5 * n.t)
        const color = `var(${KIND_VAR[n.kind]})`
        return (
          <g key={n.label}>
            <circle cx={n.sx} cy={n.sy} r={r * 2.6} style={{ fill: color }} opacity={0.12} />
            <circle cx={n.sx} cy={n.sy} r={r} style={{ fill: color }} opacity={0.45 + 0.55 * n.t} />
            {n.t > 0.35 && (
              <text x={n.sx + r + 6} y={n.sy + 3.5} fontSize={10.5} style={{ fill: 'var(--ink-2)', fontFamily: 'var(--mono)' }} opacity={0.5 + 0.4 * n.t}>
                {n.label}
              </text>
            )}
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r={8} style={{ fill: 'var(--scene-core)' }} />
    </svg>
  )
}

// ─── Live scene (Three.js) ────────────────────────────────────────────────────

function mountScene(
  THREE: ThreeModule,
  root: HTMLDivElement,
  labelsHost: HTMLDivElement,
  onReady: () => void,
  recolorRef: MutableRefObject<(() => void) | null>,
): () => void {
  let renderer: InstanceType<ThreeModule['WebGLRenderer']>
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  } catch {
    return () => {} // No WebGL: the poster stays.
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.domElement.className = 'pf6-scene__canvas'
  root.insertBefore(renderer.domElement, labelsHost)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50)
  camera.position.set(0, 1.1, 5.4)
  camera.lookAt(0, 0, 0)

  const group = new THREE.Group()
  group.position.x = 0.35 // nudge right, so more of it shows beside the cards
  scene.add(group)

  const sphere = new THREE.SphereGeometry(1, 20, 20)
  const nodeMat = Object.fromEntries(KINDS.map(k => [k, new THREE.MeshBasicMaterial()])) as Record<Kind, InstanceType<ThreeModule['MeshBasicMaterial']>>
  const haloMat = Object.fromEntries(KINDS.map(k => [k, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.14, depthWrite: false })])) as Record<Kind, InstanceType<ThreeModule['MeshBasicMaterial']>>
  const edgeMat = Object.fromEntries(KINDS.map(k => [k, new THREE.LineBasicMaterial({ transparent: true, opacity: 0.28 })])) as Record<Kind, InstanceType<ThreeModule['LineBasicMaterial']>>
  const coreMat = new THREE.MeshBasicMaterial()
  const ringMat = new THREE.LineDashedMaterial({ dashSize: 0.06, gapSize: 0.08, transparent: true, opacity: 0.3 })

  for (const n of NODES) {
    const size = n.kind === 'project' ? 0.075 : 0.05
    const node = new THREE.Mesh(sphere, nodeMat[n.kind])
    node.scale.setScalar(size)
    node.position.set(n.x, n.y, n.z)
    const halo = new THREE.Mesh(sphere, haloMat[n.kind])
    halo.scale.setScalar(size * 2.6)
    halo.position.copy(node.position)
    group.add(node, halo)
  }
  const core = new THREE.Mesh(sphere, coreMat)
  core.scale.setScalar(0.09)
  group.add(core)

  for (const kind of KINDS) {
    const positions = NODES.filter(n => n.kind === kind).flatMap(n => [0, 0, 0, n.x, n.y, n.z])
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    group.add(new THREE.LineSegments(geometry, edgeMat[kind]))
  }
  const ringGeometry = new THREE.BufferGeometry().setFromPoints(
    NODES.filter(n => n.kind === 'stack').map(n => new THREE.Vector3(n.x, n.y, n.z)),
  )
  const stackRing = new THREE.LineLoop(ringGeometry, ringMat)
  stackRing.computeLineDistances()
  group.add(stackRing)

  const labels = NODES.map(n => {
    const el = document.createElement('span')
    el.className = 'pf6-scene__label'
    el.textContent = n.label
    labelsHost.appendChild(el)
    return el
  })

  // Colours come from the CSS tokens, so the scene follows the theme.
  const recolor = () => {
    const css = getComputedStyle(root)
    const token = (name: string) => css.getPropertyValue(name).trim() || '#888888'
    for (const k of KINDS) {
      const c = token(KIND_VAR[k])
      nodeMat[k].color.set(c)
      haloMat[k].color.set(c)
      edgeMat[k].color.set(c)
    }
    ringMat.color.set(token('--scene-stack'))
    coreMat.color.set(token('--scene-core'))
  }
  recolor()
  recolorRef.current = recolor

  let width = 0, height = 0
  const resize = () => {
    const rect = root.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    width = rect.width
    height = rect.height
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(root)
  resize()

  // A gentle tilt toward the pointer.
  let targetTiltX = 0, targetTiltY = 0, tiltX = 0, tiltY = 0
  const onPointer = (e: PointerEvent) => {
    const rect = root.getBoundingClientRect()
    targetTiltY = ((e.clientX - rect.left) / rect.width - 0.5) * 0.5
    targetTiltX = ((e.clientY - rect.top) / rect.height - 0.5) * 0.3
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  let visible = true
  let raf = 0
  let last = performance.now()
  let spin = 0
  let announced = false
  const point = new THREE.Vector3()

  const frame = (now: number) => {
    raf = 0
    if (!visible || document.hidden) return
    const dt = Math.min(64, now - last)
    last = now
    spin += dt * 0.00012
    tiltX += (targetTiltX - tiltX) * 0.05
    tiltY += (targetTiltY - tiltY) * 0.05
    group.rotation.set(tiltX, spin + tiltY, 0)
    group.updateMatrixWorld()
    renderer.render(scene, camera)

    NODES.forEach((n, i) => {
      point.set(n.x, n.y, n.z).applyMatrix4(group.matrixWorld)
      const t = nearness(point.z)
      point.project(camera)
      const x = (point.x * 0.5 + 0.5) * width
      const y = (-point.y * 0.5 + 0.5) * height
      labels[i].style.transform = `translate(${x + 8}px, ${y - 7}px)`
      labels[i].style.opacity = t < 0.35 ? '0' : String(0.35 + 0.6 * t)
    })

    if (!announced) {
      announced = true
      onReady()
    }
    raf = requestAnimationFrame(frame)
  }
  const play = () => {
    if (raf || !visible || document.hidden) return
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    play()
  })
  visibilityObserver.observe(root)
  document.addEventListener('visibilitychange', play)
  play()

  return () => {
    cancelAnimationFrame(raf)
    visibilityObserver.disconnect()
    resizeObserver.disconnect()
    window.removeEventListener('pointermove', onPointer)
    document.removeEventListener('visibilitychange', play)
    labels.forEach(el => el.remove())
    scene.traverse(object => {
      if ('geometry' in object) (object.geometry as { dispose(): void }).dispose()
    })
    for (const k of KINDS) {
      nodeMat[k].dispose()
      haloMat[k].dispose()
      edgeMat[k].dispose()
    }
    coreMat.dispose()
    ringMat.dispose()
    renderer.dispose()
    renderer.domElement.remove()
    recolorRef.current = null
  }
}

export function HeroScene({ theme, reduceMotion }: { theme: PortfolioTheme; reduceMotion: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const labelsRef = useRef<HTMLDivElement>(null)
  const recolorRef = useRef<(() => void) | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    const labelsHost = labelsRef.current
    if (reduceMotion || !root || !labelsHost) return

    let cancelled = false
    let unmount: (() => void) | undefined

    // Download Three.js only when the hero is (nearly) on screen.
    const nearViewport = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return
      nearViewport.disconnect()
      import('three')
        .then(THREE => {
          if (!cancelled) unmount = mountScene(THREE, root, labelsHost, () => setReady(true), recolorRef)
        })
        .catch(error => console.warn('[HeroScene] Three.js failed to load; keeping the poster.', error))
    }, { rootMargin: '200px' })
    nearViewport.observe(root)

    return () => {
      cancelled = true
      nearViewport.disconnect()
      unmount?.()
      setReady(false)
    }
  }, [reduceMotion])

  // Theme switch: the CSS tokens have changed by the time effects run.
  useEffect(() => {
    recolorRef.current?.()
  }, [theme])

  return (
    <div ref={rootRef} className="pf6-scene" data-ready={ready} aria-hidden="true">
      <ScenePoster />
      <div ref={labelsRef} className="pf6-scene__labels" />
      <div className="pf6-scene__legend">
        <i style={{ background: 'var(--scene-stack)' }} /> Stack
        <i style={{ background: 'var(--scene-project)' }} /> Projects
        <i style={{ background: 'var(--scene-pm)' }} /> PM
      </div>
    </div>
  )
}
