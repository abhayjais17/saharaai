'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import { useSpeech } from '@/hooks/useSpeech'

type SpeakButtonProps = {
  text: string
  autoPlay?: boolean
}

export function SpeakButton({ text, autoPlay = false }: SpeakButtonProps) {
  const { language } = useLanguage()
  const { speak, speaking, cancel } = useSpeech(language)
  const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {
    if (autoPlay && !hasPlayed && text.trim()) {
      speak(text)
      setHasPlayed(true)
    }
  }, [autoPlay, hasPlayed, text, speak])

  const handleClick = () => {
    if (speaking) {
      cancel()
    } else {
      speak(text)
    }
  }

  if (!text.trim()) return null

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 rounded-full border border-peacock bg-paper px-4 py-2 text-[16px] font-medium text-peacock hover:bg-mint-soft focus-visible:outline-peacock focus-visible:outline-offset-2"
      aria-label={speaking ? 'Stop speaking' : 'Read aloud'}
    >
      {speaking ? (
        <>
          <VolumeX className="size-5" aria-hidden="true" />
          <span className="hidden sm:inline">Playing…</span>
          <motion.span
            className="flex gap-0.5"
            aria-hidden="true"
          >
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="h-3 w-0.5 rounded-full bg-peacock"
                animate={{ scaleY: [1, 1.5, 1] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </motion.span>
        </>
      ) : (
        <>
          <Volume2 className="size-5" aria-hidden="true" />
          <span className="hidden sm:inline">Listen</span>
        </>
      )}
    </motion.button>
  )
}
