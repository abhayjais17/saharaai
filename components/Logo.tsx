'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'
import { useLanguage } from '@/components/LanguageProvider'

type LogoProps = { size?: 'sm' | 'md' | 'lg'; tone?: 'light' | 'dark'; animated?: boolean }

const sizes = { sm: 'text-[30px]', md: 'text-[40px]', lg: 'text-[56px]' }

export function Logo({ size = 'md', tone = 'light', animated = false }: LogoProps) {
  const reducedMotion = useReducedMotion()
  const { t } = useLanguage()
  return (
    <span role="img" aria-label={t('brand.name')} className={cn('inline-flex items-baseline gap-2', tone === 'dark' ? 'text-on-dark' : 'text-ink', sizes[size])}>
      <span aria-hidden="true" lang="hi" className="relative isolate inline-block font-serif font-normal leading-[1.35]">
        <svg aria-hidden="true" viewBox="0 0 160 30" preserveAspectRatio="none" className="absolute inset-x-0 bottom-[0.2em] -z-10 h-[0.38em] w-full -rotate-[1.5deg] overflow-visible">
          <motion.path
            data-logo-swipe
            d="M9 19 Q47 10 83 16 T151 12"
            fill="none"
            stroke="var(--marker)"
            strokeWidth="22"
            strokeLinecap="butt"
            pathLength={1}
            strokeDasharray="1 1"
            initial={{ strokeDashoffset: animated ? 1 : 0 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: animated && !reducedMotion ? 0.5 : 0, ease: EASE }}
          />
        </svg>
        {t('brand.wordmark')}
      </span>
      <span aria-hidden="true" className="font-sans text-[0.36em] font-bold leading-none">{t('brand.ai')}</span>
    </span>
  )
}
