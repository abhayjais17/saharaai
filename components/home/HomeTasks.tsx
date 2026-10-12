'use client'

import Link from 'next/link'
import { ChevronRight, Globe, MessageSquareText, ScanLine } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLanguage } from '@/components/LanguageProvider'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { TASK_ROUTES } from '@/lib/recent'
import type { TranslationKey } from '@/lib/i18n'

const tasks = [
  { type: 'form', icon: ScanLine, shape: 'rounded-full bg-peacock text-paper' },
  { type: 'message', icon: MessageSquareText, shape: 'rounded-[12px] bg-mint-soft text-peacock-d' },
  { type: 'website', icon: Globe, shape: 'bg-ok text-paper [clip-path:polygon(25%_4%,75%_4%,100%_50%,75%_96%,25%_96%,0_50%)]' },
] as const

export function HomeTasks() {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  return (
    <motion.nav aria-label={t('home.tasks')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: reduced ? 0 : 0.8, ease: EASE }}>
      <ul className="grid divide-y divide-paper-2 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {tasks.map(({ type, icon: Icon, shape }) => (
          <li key={type}>
            <Link href={TASK_ROUTES[type]} className="interactive-row grid min-h-[112px] grid-cols-[56px_1fr_16px] items-center gap-x-3 gap-y-5 py-5 pl-1 pr-2 lg:h-full lg:grid-cols-[1fr_20px] lg:grid-rows-[56px_1fr] lg:items-start lg:px-6 lg:py-8">
              <span className={cn('flex size-14 shrink-0 items-center justify-center', shape)}><Icon className="size-7" strokeWidth={1.7} aria-hidden="true" /></span>
              <span className="flex min-w-0 flex-col gap-2 lg:col-span-2 lg:row-start-2">
                <span className="text-[20px] font-bold leading-[1.4] text-ink">{t(`home.task.${type}.title` as TranslationKey)}</span>
                <span className="text-[16px] leading-[1.6] text-peacock-d">{t(`home.task.${type}.help` as TranslationKey)}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 self-center text-peacock lg:col-start-2 lg:row-start-1 lg:size-5" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  )
}
