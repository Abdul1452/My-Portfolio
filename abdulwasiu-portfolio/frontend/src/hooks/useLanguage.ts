/**
 * useLanguage.ts — Hook to Consume the Language Context
 *
 * Mirrors useTheme.ts exactly: throws a clear error if used outside
 * <LanguageProvider> instead of a confusing "cannot read language of
 * undefined" crash.
 */

import { useContext } from 'react'
import { LanguageContext } from '@context/LanguageContext'

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (context === undefined) {
    throw new Error(
      'useLanguage must be used within a <LanguageProvider>. ' +
      'Wrap your app (usually in main.tsx) with <LanguageProvider>.'
    )
  }

  return context
}
