'use client'

import { LockKeyhole, ShieldCheck, Volume2 } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'

const items = [{ icon: ShieldCheck, key: 'trust.noOtp' }, { icon: LockKeyhole, key: 'trust.local' }, { icon: Volume2, key: 'trust.voice' }] as const

export function TrustRow() {
  const { t } = useLanguage()
  return (
    <ul aria-label={t('trust.title')} className="order-3 grid divide-y divide-paper-2 border-y border-paper-2 lg:order-2 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
      {items.map(({ icon: Icon, key }) => (
        <li key={key} className="flex items-center gap-4 py-5 lg:px-6 lg:py-6"><Icon className="size-6 shrink-0 text-peacock" strokeWidth={1.6} aria-hidden="true" /><span className="text-[16px] font-semibold leading-relaxed text-peacock-d">{t(key)}</span></li>
      ))}
    </ul>
  )
}
