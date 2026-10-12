'use client'

import { useCallback } from 'react'
import type { Language } from '@/lib/types'

type VoiceCommand = 'done' | 'back' | 'repeat'

const commands: Record<Language, Record<VoiceCommand, string[]>> = {
  en: {
    done: ['done', 'next', 'finished', 'ho gaya'],
    back: ['back', 'previous', 'peeche'],
    repeat: ['repeat', 'again', 'phir se', 'phir se bolo'],
  },
  hi: {
    done: ['हो गया', 'अगला', 'next', 'done'],
    back: ['पीछे', 'वापस', 'back', 'peeche'],
    repeat: ['फिर से बोलो', 'दोबारा', 'फिर से', 'repeat', 'phir se bolo'],
  },
}

export function useVoiceCommands(
  language: Language,
  handlers: {
    onDone?: () => void
    onBack?: () => void
    onRepeat?: () => void
  }
) {
  const parseCommand = useCallback(
    (transcript: string): VoiceCommand | null => {
      const normalized = transcript.toLowerCase().trim()
      const langCommands = commands[language]

      for (const [cmd, patterns] of Object.entries(langCommands)) {
        if (patterns.some(pattern => normalized.includes(pattern))) {
          return cmd as VoiceCommand
        }
      }
      return null
    },
    [language]
  )

  const handleTranscript = useCallback(
    (transcript: string) => {
      const command = parseCommand(transcript)
      if (!command) return false

      switch (command) {
        case 'done':
          handlers.onDone?.()
          return true
        case 'back':
          handlers.onBack?.()
          return true
        case 'repeat':
          handlers.onRepeat?.()
          return true
      }
      return false
    },
    [parseCommand, handlers]
  )

  return { parseCommand, handleTranscript }
}
