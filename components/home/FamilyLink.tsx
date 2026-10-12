'use client'

import Link from 'next/link'
import { ChevronRight, HeartHandshake } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'

export function FamilyLink() {
  const { t } = useLanguage()
  return (
    <aside className="rounded-[20px] bg-paper-2 p-6 lg:p-8">
      <HeartHandshake className="mb-4 size-8 text-peacock" strokeWidth={1.6} aria-hidden="true" />
      <h2 className="text-[22px] font-bold leading-normal">{t('nav.family')}</h2>
      <Link href="/family" className="interactive-row mt-2 flex min-h-12 items-center gap-4 py-2 text-[18px] leading-relaxed text-peacock-d">
        <span className="flex-1">{t('home.family')}</span><ChevronRight className="size-5 shrink-0" aria-hidden="true" />
      </Link>
    </aside>
  )
}
