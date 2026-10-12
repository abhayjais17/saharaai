'use client'

import { useLanguage } from '@/components/LanguageProvider'
import { StepIllustration } from './StepIllustration'

export function HowItWorks() {
  const { t } = useLanguage()
  return (
    <section aria-labelledby="how-heading" className="order-2 py-12 lg:order-1 lg:py-20">
      <h2 id="how-heading" className="font-display text-[30px] leading-tight tracking-[-0.01em]">{t('home.how.title')}</h2>
      <ol className="how-steps relative mt-8 grid gap-8 lg:mt-10 lg:grid-cols-3 lg:gap-12">
        {([1, 2, 3] as const).map(step => (
          <li key={step} className="relative grid grid-cols-[40px_1fr] gap-x-4 lg:flex lg:flex-col lg:items-start lg:gap-5">
            <span className="relative flex size-10 items-center justify-center rounded-full border border-peacock/25 bg-paper text-[18px] font-semibold tabular-nums text-peacock-d">{t(`home.how.${step}.number`)}</span>
            <div className="flex flex-col items-start gap-2">
              <StepIllustration step={step} />
              <h3 className="text-[22px] font-bold leading-normal">{t(`home.how.${step}.title`)}</h3>
              <p className="max-w-[320px] text-[18px] leading-relaxed text-peacock-d">{t(`home.how.${step}.text`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
