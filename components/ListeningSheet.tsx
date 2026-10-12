'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Square } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import { EASE } from '@/lib/motion'

type ListeningSheetProps = {
  transcript: string
  onStop: () => void
  amplitude?: number
}

export function ListeningSheet({ transcript, onStop, amplitude = 0.5 }: ListeningSheetProps) {
  const { t } = useLanguage()
  const reduced = useReducedMotion()

  // Generate waveform bars based on amplitude (0 to 1)
  const bars = Array.from({ length: 5 }, (_, i) => {
    const baseHeight = 0.3 + (amplitude * 0.7)
    const variance = Math.sin(i * 0.5) * 0.2
    return Math.max(0.2, Math.min(1, baseHeight + variance))
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2, ease: EASE }}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-forest-800 bg-forest-900 px-4 pb-8 pt-6 shadow-2xl"
    >
      <div className="mx-auto max-w-2xl">
        {/* Waveform */}
        <div className="mb-6 flex items-center justify-center gap-1" aria-hidden="true">
          {bars.map((height, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-mint"
              style={{ height: '48px' }}
              animate={reduced ? { scaleY: height } : { scaleY: [height * 0.8, height, height * 0.8] }}
              transition={reduced ? { duration: 0.2 } : {
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>

        {/* Live Transcript */}
        <div
          className="mb-6 min-h-[80px] rounded-xl bg-forest-800/50 px-6 py-4"
          role="log"
          aria-live="polite"
          aria-atomic="true"
        >
          {transcript ? (
            <p className="text-[24px] leading-[1.5] text-on-dark">
              {transcript}
            </p>
          ) : (
            <p className="text-[20px] leading-[1.5] text-on-dark-muted">
              {t('home.listening')}
            </p>
          )}
        </div>

        {/* Stop Button */}
        <button
          type="button"
          onClick={onStop}
          className="mx-auto flex w-full max-w-xs items-center justify-center gap-3 rounded-full bg-alert px-8 py-4 text-[18px] font-semibold text-white hover:bg-alert/90 focus-visible:outline-alert focus-visible:outline-offset-2"
        >
          <Square className="size-6" strokeWidth={2} aria-hidden="true" />
          {t('voice.stop')}
        </button>
      </div>
    </motion.div>
  )
}
