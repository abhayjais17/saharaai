'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import { PageContainer } from '@/components/PageContainer'
import { buttonVariants } from '@/components/ui/button'

export function UnavailablePage() {
  const { t } = useLanguage()
  return (
    <PageContainer variant="reading">
      <section className="flex flex-col items-start gap-6 py-12 lg:py-20">
        <h1 className="font-display text-[30px] leading-[1.2]">{t('navigation.unavailable')}</h1>
        <p className="text-[18px] leading-relaxed">{t('navigation.help')}</p>
        <Link href="/" className={buttonVariants({ size: 'touch' })}>{t('common.home')}</Link>
      </section>
    </PageContainer>
  )
}
