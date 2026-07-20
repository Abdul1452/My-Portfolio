/**
 * useIntersectionObserver.ts — Detect When an Element Enters the Viewport
 *
 * THE BROWSER API:
 *   IntersectionObserver watches an element and fires a callback whenever
 *   that element enters or leaves the viewport (or crosses a threshold).
 *   It's efficient — the browser handles it off the main thread, so there's
 *   no janky scroll-event math.
 *
 * TWO REACT HOOKS THIS USES:
 *   useRef  — holds a reference to the DOM element we want to watch.
 *             Unlike useState, updating a ref does NOT trigger a re-render.
 *             Think of it as a "box" that persists across renders.
 *   useState — holds the boolean "is it visible right now?" which DOES
 *             trigger a re-render so the UI can react.
 *   useEffect — sets up the observer on mount, cleans it up on unmount.
 *
 * HOW COMPONENTS USE IT:
 *   const { ref, isIntersecting } = useIntersectionObserver()
 *   return <div ref={ref}>{isIntersecting ? 'visible!' : 'hidden'}</div>
 *
 *   You attach the returned `ref` to any element via the ref={} prop.
 *   isIntersecting flips to true when that element scrolls into view.
 */

import { useEffect, useRef, useState } from 'react'

// Options let callers tune the behavior.
interface UseIntersectionObserverOptions {
  // threshold: how much of the element must be visible to count as "intersecting"
  //   0   = fire as soon as 1px is visible
  //   0.5 = fire when 50% is visible
  //   1   = fire only when 100% is visible
  threshold?: number

  // rootMargin: grow/shrink the viewport box for detection.
  //   '0px 0px -100px 0px' means "trigger 100px BEFORE the element reaches
  //   the bottom of the screen" — useful for revealing slightly early.
  rootMargin?: string

  // freezeOnceVisible: once the element has been seen, stop observing.
  //   For fade-in animations you usually want this true — reveal once,
  //   then never hide again even if the user scrolls back up.
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    freezeOnceVisible = true,
  } = options

  // The ref that the caller attaches to their element.
  // <T> is a generic so it works for any element type (div, section, etc.)
  const ref = useRef<T>(null)

  // Whether the element is currently intersecting the viewport.
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    // If the ref isn't attached yet, or we've frozen after being visible, skip.
    if (!element) return
    if (freezeOnceVisible && isIntersecting) return

    // Create the observer. The callback receives an array of "entries"
    // (one per observed element — we only observe one, so entries[0]).
    const observer = new IntersectionObserver(
      ([entry]) => {
        // entry.isIntersecting is true when the element is in view
        if (entry.isIntersecting) {
          setIsIntersecting(true)

          // If freezing, disconnect immediately so we never fire again.
          if (freezeOnceVisible) {
            observer.disconnect()
          }
        } else if (!freezeOnceVisible) {
          // Only allow hiding again if we're NOT freezing.
          setIsIntersecting(false)
        }
      },
      { threshold, rootMargin }
    )

    // Start watching our element.
    observer.observe(element)

    // CLEANUP: useEffect returns a function that runs when the component
    // unmounts (or before the effect re-runs). We disconnect the observer
    // to avoid memory leaks. ALWAYS clean up observers/listeners/timers.
    return () => observer.disconnect()
  }, [threshold, rootMargin, freezeOnceVisible, isIntersecting])

  return { ref, isIntersecting }
}
