'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserRound } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import { PageContainer } from '@/components/PageContainer'
import { useLanguage } from '@/components/LanguageProvider'
import { cn } from '@/lib/utils'

const links = [
  { href: '/form', key: 'home.task.form.title' },
  { href: '/message', key: 'home.task.message.title' },
  { href: '/website', key: 'home.task.website.title' },
  { href: '/family', key: 'nav.family' },
] as const

export function AppHeader() {
  const { t } = useLanguage()
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-30 border-b border-on-dark/10 bg-forest-900 text-on-dark">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-xl focus:bg-mint focus:px-4 focus:py-3 focus:text-forest-950">{t('nav.skip')}</a>
      <PageContainer className="flex min-h-[88px] items-center justify-between gap-3 lg:gap-4">
        <Link href="/" aria-label={t('common.home')} className="flex min-h-12 shrink-0 items-center rounded-xl focus-visible:outline-mint"><Logo size="md" tone="dark" animated /></Link>
        <nav aria-label={t('nav.main')} className="hidden min-w-0 flex-1 justify-center lg:flex">
          <ul className="flex items-stretch gap-1 xl:gap-3">
            {links.map(({ href, key }) => (
              <li key={href} className="flex">
                <Link href={href} aria-current={pathname === href ? 'page' : undefined} className={cn('header-link flex min-h-12 max-w-[180px] items-center border-b-2 px-2 py-2 text-[16px] font-medium leading-snug focus-visible:outline-mint', pathname === href ? 'border-mint text-on-dark' : 'border-transparent text-on-dark-muted')}>{t(key)}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex shrink-0 items-center gap-2 xl:gap-4">
          <LanguageSwitch />
          <Link href="/profile" aria-label={t('nav.myDetails')} aria-current={pathname === '/profile' ? 'page' : undefined} className="header-link flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full bg-forest-800 px-3 focus-visible:outline-mint active:bg-forest-950">
            <UserRound className="size-6 shrink-0" aria-hidden="true" />
            <span className="hidden text-[16px] xl:inline">{t('nav.myDetails')}</span>
          </Link>
        </div>
      </PageContainer>
    </header>
  )
}
