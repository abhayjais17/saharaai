import { AppHeader } from '@/components/AppHeader'
import { Footer } from '@/components/Footer'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <AppHeader />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
