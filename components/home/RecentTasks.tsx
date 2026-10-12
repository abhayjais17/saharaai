'use client'

import Link from 'next/link'
import { Files, Globe, MessageSquareText, ScanLine } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import { Empty, EmptyDescription, EmptyHeader } from '@/components/ui/empty'
import { useRecent } from '@/hooks/useRecent'
import { recentDate, TASK_ROUTES } from '@/lib/recent'

const icons = { form: ScanLine, message: MessageSquareText, website: Globe }

export function RecentTasks() {
  const { t, language } = useLanguage()
  const tasks = useRecent()
  return (
    <section aria-labelledby="recent-heading" className="min-w-0 lg:py-4">
      <h2 id="recent-heading" className="text-[22px] font-bold text-ink">{t('home.recent')}</h2>
      {tasks.length === 0 ? (
        <Empty className="mt-5"><EmptyHeader className="flex-row gap-5"><Files className="size-10 shrink-0 text-peacock/60" strokeWidth={1.25} aria-hidden="true" /><EmptyDescription>{t('home.recentEmpty')}</EmptyDescription></EmptyHeader></Empty>
      ) : (
        <ul className="mt-2 divide-y divide-paper-2">
          {tasks.map(task => {
            const Icon = icons[task.type]
            return (
              <li key={task.id}>
                <Link href={TASK_ROUTES[task.type]} className="interactive-row flex min-h-[64px] items-center gap-3 px-2 py-3">
                  <Icon className="size-5 shrink-0 text-peacock" aria-hidden="true" />
                  <span className="min-w-0 flex-1 break-words text-[18px] leading-snug">{task.title}</span>
                  <time dateTime={new Date(task.createdAt).toISOString()} className="shrink-0 text-[16px] text-peacock-d">{recentDate(task.createdAt, language)}</time>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
