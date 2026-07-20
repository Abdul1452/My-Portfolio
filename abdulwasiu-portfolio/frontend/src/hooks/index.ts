/**
 * hooks/index.ts — Barrel Export for all custom hooks
 *
 * Lets components import any hook from one place:
 *   import { useTheme, useScrollAnimation, useContactForm } from '@hooks'
 */

export { useTheme } from './useTheme'
export { useApp } from './useApp'
export { useIntersectionObserver } from './useIntersectionObserver'
export { useScrollAnimation } from './useScrollAnimation'
export { useMobileMenu } from './useMobileMenu'
export { useContactForm } from './useContactForm'
