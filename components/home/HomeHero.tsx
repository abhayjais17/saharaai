'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { PageContainer } from '@/components/PageContainer'
import { HeroPattern } from './HeroPattern'
import { useLanguage } from '@/components/LanguageProvider'
import { EASE } from '@/lib/motion'
import { HomeMic } from './HomeMic'
import { HomePrompt } from './HomePrompt'

export function HomeHero() {
  const { t, language } = useLanguage()
  const reduced = useReducedMotion()
  return (
    <section aria-labelledby="home-greeting" className="relative isolate overflow-hidden bg-forest-900 text-on-dark">
      <HeroPattern />
      <PageContainer className="relative grid grid-cols-1 gap-y-4 pb-16 pt-10 md:pt-12 lg:min-h-[536px] lg:grid-cols-[1.25fr_1fr] lg:content-center lg:gap-x-16 lg:gap-y-6 lg:py-20">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1 lg:self-end">
          <h1 id="home-greeting" key={`greeting-${language}`} aria-label={t('home.greeting')} className="max-w-[620px] text-balance font-display text-[clamp(30px,4vw,52px)] leading-[1.15] tracking-[-0.01em]">
            {t('home.greeting').split(' ').map((word, index, words) => (
              <motion.span key={index} aria-hidden="true" className="inline-block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: reduced ? 0 : 0.18 + index * 0.06, ease: EASE }}>
                {word}{index < words.length - 1 ? '\u00a0' : ''}
              </motion.span>
            ))}
          </h1>
          <p className="mt-5 max-w-[440px] text-[18px] leading-relaxed text-on-dark-muted lg:text-[20px]">{t('home.support')}</p>
        </div>
        <div className="relative flex justify-center py-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:items-center lg:py-12">
          <div aria-hidden="true" className="absolute top-1/2 hidden aspect-square w-[340px] -translate-y-1/2 rounded-[44%_56%_48%_52%] bg-forest-800/60 lg:block" />
          <HomeMic />
        </div>
        <HomePrompt key={`prompt-${language}`} />
      </PageContainer>
    </section>
  )
}
