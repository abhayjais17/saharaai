'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import { get, set } from '@/lib/storage'

export function AudioToggle() {
  const { t } = useLanguage()
  const muted = get<{ muted?: boolean }>('sahara.settings')?.muted ?? false

  const toggle = () => {
    const current = get<{ muted?: boolean }>('sahara.settings') ?? {}
    set('sahara.settings', { ...current, muted: !muted })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
      aria-pressed={!muted}
      title={muted ? 'Turn sound on' : 'Turn sound off'}
      className="flex items-center justify-center rounded-full p-2 text-on-dark hover:bg-forest-800 focus-visible:outline-mint focus-visible:outline-offset-2"
    >
      {muted ? (
        <VolumeX className="size-5" aria-hidden="true" />
      ) : (
        <Volume2 className="size-5" aria-hidden="true" />
      )}
    </button>
  )
}
