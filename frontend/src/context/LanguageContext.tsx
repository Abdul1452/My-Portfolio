/**
 * LanguageContext.tsx — EN/FI Language Global State
 *
 * Same shape as ThemeContext: tracks the active language, persists the
 * choice to localStorage, and falls back to the browser's language on
 * first visit. Components read the current language via useLanguage()
 * and look up copy from a translation dictionary (see
 * data/coastal-translations.data.ts for the first consumer).
 */

import { createContext, useEffect, useState, type ReactNode } from 'react'

export type Language = 'en' | 'fi'

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const STORAGE_KEY = 'portfolio-language'

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en'

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'en' || saved === 'fi') return saved

  const browserLang = window.navigator.language?.toLowerCase() ?? ''
  return browserLang.startsWith('fi') ? 'fi' : 'en'
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const setLanguage = (next: Language) => setLanguageState(next)
  const toggleLanguage = () => setLanguageState(prev => (prev === 'en' ? 'fi' : 'en'))

  const value: LanguageContextValue = { language, setLanguage, toggleLanguage }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
