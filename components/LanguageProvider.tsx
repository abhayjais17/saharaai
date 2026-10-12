'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { t, type TranslationKey } from '@/lib/i18n'
import { get, set, STORAGE_EVENT } from '@/lib/storage'
import type { Language } from '@/lib/types'

const LANGUAGE_KEY = 'sahara.settings.language'

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
  ready: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, updateLanguage] = useState<Language>('en')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => {
      updateLanguage(get<unknown>(LANGUAGE_KEY) === 'hi' ? 'hi' : 'en')
    }
    sync()
    setReady(true)
    window.addEventListener(STORAGE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(STORAGE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    document.title = t('meta.title', language)
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      document.querySelector(selector)?.setAttribute('content', t('meta.description', language))
    }
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', language === 'hi' ? 'hi_IN' : 'en_IN')
    document.querySelector('meta[property="og:locale:alternate"]')?.setAttribute('content', language === 'hi' ? 'en_IN' : 'hi_IN')
  }, [language])

  const setLanguage = useCallback((next: Language) => {
    updateLanguage(next)
    set(LANGUAGE_KEY, next)
  }, [])

  const value = useMemo(() => ({
    language,
    setLanguage,
    ready,
    t: (key: TranslationKey) => t(key, language),
  }), [language, setLanguage, ready])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
