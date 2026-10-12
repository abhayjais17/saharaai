'use client'

import { Mic, Square, Loader2 } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLanguage } from '@/components/LanguageProvider'
import { EASE } from '@/lib/motion'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import type { Language } from '@/lib/types'

type MicButtonProps = {
  size?: 'hero' | 'compact'
  onResult?: (transcript: string) => void
  disabled?: boolean
}

export function MicButton({ size = 'hero', onResult, disabled: externalDisabled = false }: MicButtonProps) {
  const { t } = useLanguage()
  const reduced = useReducedMotion()

  // Get language from context - default to en if not ready
  const language = (typeof window !== 'undefined' && window.localStorage)
    ? (localStorage.getItem('sahara.settings.language') as Language)
    : 'en'
  const { isSupported, listening, transcript, start, stop, error } = useSpeechRecognition(language)

  const disabled = externalDisabled || !isSupported || !window.speechSynthesis?.getVoices().length

  const handleStart = () => {
    if (!listening && !disabled) {
      start()
    }
  }

  const handleStop = () => {
    if (listening) {
      stop()
    }
  }

  // Auto-stop and call onResult when we have a final transcript
  const finalTranscript = transcript.trim()
  if (finalTranscript && !listening && !error) {
    onResult?.(finalTranscript)
  }

  // Loading state while waiting for voices
  const loadingVoices = !isSupported && !listening

  if (size === 'hero') {
    return (
      <div className="relative flex flex-col items-center pt-4">
        <motion.div
          className="relative flex size-[168px] lg:size-[200px] items-center justify-center"
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: 1,
            scale: reduced ? 1 : (listening ? [0.9, 1] : [0.9, 1, 0.9])
          }}
          transition={{
            duration: reduced ? 0.18 : 0.42,
            delay: reduced ? 0 : 0.55,
            ease: EASE
          }}
        >
          {[0, 1, 2].map(index => (
            <motion.span
              key={`${listening}-${index}`}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full border border-mint/20 bg-mint/5"
              animate={reduced
                ? { scale: 1 + (index + 1) * 0.1, opacity: listening ? 0.7 : 0.4 }
                : listening
                  ? { scale: [1, 1.5], opacity: [0.6, 0] }
                  : { scale: [1 + (index + 1) * 0.1, 1.07 + (index + 1) * 0.1, 1 + (index + 1) * 0.1], opacity: [0.4, 0.7, 0.4] }
              }
              transition={reduced
                ? { duration: 0.18 }
                : {
                    duration: listening ? 1.8 : 3,
                    delay: listening ? index * 0.6 : 0.8,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }
              }
            />
          ))}
          <motion.button
            type="button"
            tabIndex={0}
            disabled={disabled || loadingVoices}
            aria-label={t(listening ? 'home.stopListening' : 'home.micLabel')}
            aria-pressed={listening}
            onClick={listening ? handleStop : handleStart}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            className="relative flex size-[168px] lg:size-[200px] cursor-pointer items-center justify-center rounded-full border border-mint bg-mint text-forest-950 before:pointer-events-none before:absolute before:inset-2 before:rounded-full before:border before:border-forest-950/15 focus-visible:outline-mint focus-visible:outline-offset-8 disabled:cursor-wait disabled:opacity-60"
          >
            {loadingVoices ? (
              <Loader2 className="size-[48px] animate-spin" aria-hidden="true" />
            ) : listening ? (
              <Square className="size-[48px]" strokeWidth={1.7} aria-hidden="true" />
            ) : (
              <Mic className="size-[64px]" strokeWidth={1.6} aria-hidden="true" />
            )}
          </motion.button>
        </motion.div>
        <p aria-live="polite" className="mt-[28px] text-[20px] font-semibold leading-[1.6] text-on-dark-muted">
          {loadingVoices
            ? t('common.loading')
            : t(listening ? 'home.listening' : 'home.micLabel')}
        </p>
        {error && (
          <p className="mt-4 text-[16px] text-alert" role="alert">
            {error === 'no-speech' ? t('voice.noSpeech') : error === 'not-allowed' ? t('voice.denied') : t('voice.unsupported')}
          </p>
        )}
      </div>
    )
  }

  // Compact size for inner pages
  return (
    <button
      type="button"
      onClick={listening ? handleStop : handleStart}
      disabled={disabled || loadingVoices || !isSupported}
      aria-label={t(listening ? 'home.stopListening' : 'home.micLabel')}
      aria-pressed={listening}
      className="flex items-center justify-center rounded-full p-2 text-forest-900 hover:bg-forest-100 focus-visible:outline-forest-900 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-50"
      title={t(listening ? 'home.stopListening' : 'home.micLabel')}
    >
      {loadingVoices ? (
        <Loader2 className="size-5 animate-spin" aria-hidden="true" />
      ) : listening ? (
        <Square className="size-5" aria-hidden="true" />
      ) : (
        <Mic className="size-5" aria-hidden="true" />
      )}
    </button>
  )
}
