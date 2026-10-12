'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import { AudioToggle } from '@/components/AudioToggle'
import { useLanguage } from '@/components/LanguageProvider'

type TopBarProps = {
  title: string
  showBack?: boolean
}

export function TopBar({ title, showBack = true }: TopBarProps) {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-forest-800 bg-forest-900">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Left: Back button or Logo */}
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              type="button"
              onClick={() => router.back()}
              aria-label={t('common.back')}
              className="flex size-12 items-center justify-center rounded-full text-on-dark hover:bg-forest-800 focus-visible:outline-mint focus-visible:outline-offset-2"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </button>
          ) : (
            <Logo size="sm" tone="dark" />
          )}
        </div>

        {/* Center: Title */}
        <h1 className="flex-1 truncate text-center text-[18px] font-semibold text-on-dark lg:text-[20px]">
          {title}
        </h1>

        {/* Right: Language switch + Audio toggle */}
        <div className="flex items-center gap-1">
          <LanguageSwitch tone="dark" />
          <AudioToggle />
        </div>
      </div>
    </header>
  )
}
