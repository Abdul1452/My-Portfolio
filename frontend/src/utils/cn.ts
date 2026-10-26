/**
 * cn.ts — Class Name Merger
 *
 * THE PROBLEM THIS SOLVES:
 *   In React you often build className strings conditionally:
 *     className={`btn ${isActive ? 'btn-active' : ''} ${size}`}
 *   This gets messy fast, and can produce awkward output like "btn  primary"
 *   (double spaces) or conflicting Tailwind classes like "p-2 p-4".
 *
 * THE TWO LIBRARIES:
 *   clsx           — cleanly joins class names, ignoring falsy values.
 *                    clsx('a', false && 'b', 'c')  →  "a c"
 *
 *   tailwind-merge — resolves CONFLICTING Tailwind classes intelligently.
 *                    twMerge('p-2 p-4')  →  "p-4"  (later wins)
 *                    Without it, both would be output and CSS specificity
 *                    would decide unpredictably.
 *
 * COMBINED:
 *   cn() runs clsx first (to join), then twMerge (to de-conflict).
 *   This is THE standard utility in modern React + Tailwind projects.
 *
 * USAGE:
 *   cn('btn', isActive && 'btn-active', className)
 *   cn('p-2', condition ? 'p-4' : 'p-6')
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ClassValue is clsx's type for anything you can pass:
// strings, arrays, objects, booleans, undefined, null.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
