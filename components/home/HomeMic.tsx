'use client'

import { useState } from 'react'
import { Mic, Square } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLanguage } from '@/components/LanguageProvider'
import { EASE } from '@/lib/motion'

export function HomeMic() {
  const [listening, setListening] = useState(false)
  const { t, ready } = useLanguage()
  const reduced = useReducedMotion()
  return (
    <div className="relative flex flex-col items-center pt-4 lg:pt-0">
      <motion.div className="relative flex size-[168px] lg:size-[200px] items-center justify-center" initial={{ opacity: 0, scale: 1 }} animate={{ opacity: ready ? 1 : 0, scale: !ready || reduced ? 1 : [0.9, 1] }} transition={{ duration: reduced ? 0.18 : 0.42, delay: reduced ? 0 : 0.55, ease: EASE }}>
        {[0, 1, 2].map(index => (
          <motion.span key={`${listening}-${index}`} aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full border border-mint/20 bg-mint/5"
            animate={reduced ? { scale: 1 + (index + 1) * 0.1, opacity: listening ? 0.7 : 0.4 } : listening ? { scale: [1, 1.5], opacity: [0.6, 0] } : { scale: [1 + (index + 1) * 0.1, 1.07 + (index + 1) * 0.1, 1 + (index + 1) * 0.1], opacity: [0.4, 0.7, 0.4] }}
            transition={reduced ? { duration: 0.18 } : { duration: listening ? 1.8 : 3, delay: listening ? index * 0.6 : 0.8, repeat: Infinity, ease: 'easeInOut' }} />
        ))}
        <motion.button type="button" tabIndex={0} disabled={!ready} aria-label={t(listening ? 'home.stopListening' : 'home.micLabel')} aria-pressed={listening} onClick={() => setListening(value => !value)} whileTap={reduced ? undefined : { scale: 0.97 }} className="relative flex size-[168px] lg:size-[200px] cursor-pointer items-center justify-center rounded-full border border-mint bg-mint text-forest-950 before:pointer-events-none before:absolute before:inset-2 before:rounded-full before:border before:border-forest-950/15 focus-visible:outline-mint focus-visible:outline-offset-8 disabled:cursor-wait">
          {listening ? <Square className="size-[48px]" strokeWidth={1.7} aria-hidden="true" /> : <Mic className="size-[64px]" strokeWidth={1.6} aria-hidden="true" />}
        </motion.button>
      </motion.div>
      <p aria-live="polite" className="mt-[28px] text-[20px] font-semibold leading-[1.6] text-on-dark-muted">{t(listening ? 'home.listening' : 'home.micLabel')}</p>
    </div>
  )
}
