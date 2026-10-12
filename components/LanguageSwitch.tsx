'use client'

import { useLanguage } from '@/components/LanguageProvider'
import { cn } from '@/lib/utils'
import type { Language } from '@/lib/types'

export function LanguageSwitch({ tone = 'dark' }: { tone?: 'light' | 'dark' }) {
  const { language, setLanguage, t, ready } = useLanguage()
  return (
    <div
      role="group"
      aria-label={t('lang.choose')}
      className={cn('inline-flex h-[36px] shrink-0 items-center rounded-full px-1 text-[16px]', tone === 'dark' ? 'bg-forest-800 text-on-dark-muted' : 'bg-paper-2 text-peacock-d')}
    >
      {(['en', 'hi'] as const).map((option: Language, index) => (
        <span key={option} className="inline-flex items-center">
          {index > 0 && <span aria-hidden="true" className="px-0.5">{'·'}</span>}
          <button
            type="button"
            lang={option}
            aria-label={t(option === 'en' ? 'lang.selectEnglish' : 'lang.selectHindi')}
            aria-pressed={language === option}
            disabled={!ready}
            onClick={() => setLanguage(option)}
            className={cn('flex h-[48px] min-w-[48px] cursor-pointer items-center rounded-full disabled:cursor-wait', tone === 'dark' ? 'focus-visible:outline-mint' : 'focus-visible:outline-peacock')}
          >
            <span className={cn('flex h-[30px] w-full items-center justify-center rounded-full px-2 leading-none', language === option && (tone === 'dark' ? 'bg-mint font-bold text-forest-950' : 'bg-mint-soft font-bold text-peacock'))}>
              {t(option === 'en' ? 'lang.english' : 'lang.hindi')}
            </span>
          </button>
        </span>
      ))}
    </div>
  )
}
