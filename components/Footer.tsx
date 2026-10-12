'use client'

import { ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { PageContainer } from '@/components/PageContainer'
import { useLanguage } from '@/components/LanguageProvider'

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-forest-950 py-8 text-on-dark-muted">
      <PageContainer className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Logo size="sm" tone="dark" />
          <p className="max-w-[280px] text-[16px] leading-relaxed">{t('footer.line')}</p>
        </div>
        <p className="flex max-w-[420px] items-start gap-3 text-[16px] leading-relaxed"><ShieldCheck className="mt-1 size-5 shrink-0 text-mint" aria-hidden="true" />{t('safety.line')}</p>
      </PageContainer>
    </footer>
  )
}
