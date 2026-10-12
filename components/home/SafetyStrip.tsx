'use client'

import { ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import { PageContainer } from '@/components/PageContainer'

export function SafetyStrip() {
  const { t } = useLanguage()
  return (
    <aside className="mt-12 bg-alert-soft py-4 text-alert lg:mt-0">
      <PageContainer className="flex min-h-8 items-center gap-3">
        <ShieldCheck className="size-6 shrink-0" strokeWidth={1.8} aria-hidden="true" />
        <p className="text-[19px] font-bold leading-relaxed">{t('safety.line')}</p>
      </PageContainer>
    </aside>
  )
}
