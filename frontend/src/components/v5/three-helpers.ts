/**
 * three-helpers.ts — What every Three.js scene on the page shares
 *
 * Two scenes use Three.js: the story globe in the hero (HeroScene) and the
 * book on the desk (BookShelf). Both follow the same rules, so the rules
 * live here once:
 *
 *   1. LOAD LATE   Three.js (~150 KB gzipped) is downloaded with a dynamic
 *                  import() only when the scene is about to scroll into
 *                  view. Until then a static poster (SVG/HTML) shows.
 *   2. RUN ONLY WHEN SEEN   The animation loop stops when the scene leaves
 *                  the viewport or the tab is hidden: no battery drain.
 *   3. CLEAN UP    Geometries, materials, textures and the WebGL context are
 *                  released when the component unmounts.
 *   4. DEGRADE     Reduced motion or no WebGL → the poster simply stays.
 */

import { useEffect, useState, type RefObject } from 'react'

export type ThreeModule = typeof import('three')

/**
 * Builds the scene inside `root` and returns a cleanup function.
 * Call `ready()` after the first frame is drawn: the poster fades out then.
 */
export type MountScene = (THREE: ThreeModule, root: HTMLDivElement, ready: () => void) => () => void

/**
 * Mounts `mount` once `rootRef` is within 200px of the viewport.
 * Returns true once the live scene has drawn its first frame.
 * `mount` should be stable (a module-level function or useCallback).
 */
export function useLazyThree(rootRef: RefObject<HTMLDivElement>, mount: MountScene, enabled: boolean): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!enabled || !root) return

    let cancelled = false
    let unmount: (() => void) | undefined

    const nearViewport = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return
      nearViewport.disconnect()
      import('three')
        .then(THREE => {
          if (!cancelled) unmount = mount(THREE, root, () => setReady(true))
        })
        .catch(error => console.warn('[three] Three.js failed to load; keeping the poster.', error))
    }, { rootMargin: '200px' })
    nearViewport.observe(root)

    return () => {
      cancelled = true
      nearViewport.disconnect()
      unmount?.()
      setReady(false)
    }
  }, [rootRef, mount, enabled])

  return ready
}

/** A transparent WebGL renderer whose canvas is added to `root`, or null without WebGL. */
export function createRenderer(THREE: ThreeModule, root: HTMLElement, className: string) {
  let renderer: InstanceType<ThreeModule['WebGLRenderer']>
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  } catch {
    return null
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.domElement.className = className
  root.prepend(renderer.domElement)
  return renderer
}

/**
 * Keeps the renderer and camera the size of `root`.
 * Returns the current size (read it every frame) and a stop function.
 */
export function trackSize(
  root: HTMLElement,
  renderer: InstanceType<ThreeModule['WebGLRenderer']>,
  camera: InstanceType<ThreeModule['PerspectiveCamera']>,
) {
  const size = { width: 0, height: 0 }
  const resize = () => {
    const rect = root.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    size.width = rect.width
    size.height = rect.height
    renderer.setSize(rect.width, rect.height, false)
    camera.aspect = rect.width / rect.height
    camera.updateProjectionMatrix()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(root)
  resize()
  return { size, stop: () => observer.disconnect() }
}

/**
 * requestAnimationFrame loop that only runs while `root` is on screen and
 * the tab is visible. `onFrame` gets the milliseconds since the last frame
 * (capped, so a long pause doesn't make things jump).
 */
export function visibleLoop(root: Element, onFrame: (dt: number, now: number) => void) {
  let visible = true
  let raf = 0
  let last = performance.now()

  const frame = (now: number) => {
    raf = 0
    if (!visible || document.hidden) return
    // rAF's timestamp can be a little EARLIER than the performance.now()
    // taken when the loop (re)started, so clamp at 0: a negative step
    // would run animations backwards for a frame.
    const dt = Math.max(0, Math.min(64, now - last))
    last = now
    onFrame(dt, now)
    raf = requestAnimationFrame(frame)
  }
  const play = () => {
    if (raf || !visible || document.hidden) return
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    play()
  })
  observer.observe(root)
  document.addEventListener('visibilitychange', play)
  play()

  return () => {
    cancelAnimationFrame(raf)
    observer.disconnect()
    document.removeEventListener('visibilitychange', play)
  }
}

/** Frees every geometry, material and texture in the scene, then the renderer. */
export function disposeAll(
  scene: InstanceType<ThreeModule['Scene']>,
  renderer: InstanceType<ThreeModule['WebGLRenderer']>,
) {
  scene.traverse(object => {
    const mesh = object as { geometry?: { dispose(): void }; material?: unknown }
    mesh.geometry?.dispose()
    const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : []
    for (const material of materials as { dispose(): void; map?: { dispose(): void } | null }[]) {
      material.map?.dispose()
      material.dispose()
    }
  })
  renderer.dispose()
  renderer.domElement.remove()
}

/** Reads a CSS custom property from `el` (e.g. '--accent'), with a fallback. */
export function cssToken(el: Element, name: string, fallback = '#888888') {
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback
}
