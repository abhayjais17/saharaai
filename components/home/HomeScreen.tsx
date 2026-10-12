'use client'

import { PageContainer } from '@/components/PageContainer'
import { HowItWorks } from './HowItWorks'
import { TrustRow } from './TrustRow'
import { FamilyLink } from './FamilyLink'
import { useLanguage } from '@/components/LanguageProvider'
import { HomeHero } from './HomeHero'
import { HomeTasks } from './HomeTasks'
import { RecentTasks } from './RecentTasks'
import { SafetyStrip } from './SafetyStrip'

export function HomeScreen() {
  const { ready } = useLanguage()
  return (
    <div data-home-ready={ready}>
      <HomeHero />
      <div className="relative -mt-6 rounded-t-[20px] bg-paper pt-3">
        <PageContainer>
          <HomeTasks />
          <div className="flex flex-col border-t border-paper-2">
            <div className="order-1 grid gap-8 pb-0 pt-12 lg:order-3 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:py-20">
              <RecentTasks />
              <FamilyLink />
            </div>
            <HowItWorks />
            <TrustRow />
          </div>
        </PageContainer>
      </div>
      <SafetyStrip />
    </div>
  )
}
