import { TopBar } from '@/components/TopBar'

export default function FormPage() {
  return (
    <main className="min-h-dvh bg-paper">
      <TopBar title="Scan a form" />
      <div className="flex min-h-[calc(100dvh-56px)] items-center justify-center">
        <div className="max-w-2xl space-y-6 px-4 text-center">
          <h1 className="text-[30px] font-display font-bold text-ink">
            Form Scanner
          </h1>
          <p className="text-[20px] text-ink/80">
            This page will guide you through scanning and filling forms.
          </p>
          <div className="rounded-xl border border-paper-2 bg-paper p-6">
            <p className="text-[18px] text-peacock">
              Feature coming soon! You'll be able to scan forms and get step-by-step guidance.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
