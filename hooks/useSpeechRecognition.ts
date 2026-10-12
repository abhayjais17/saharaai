'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Recognition, SpeechWindow } from '@/lib/speech-types'
import type { Language } from '@/lib/types'

export function useSpeechRecognition(language: Language) {
  const recognition = useRef<Recognition | null>(null)
  const active = useRef(false)
  const [isSupported, setIsSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const browser = window as SpeechWindow
    const Constructor = browser.SpeechRecognition ?? browser.webkitSpeechRecognition
    setIsSupported(Boolean(Constructor))
    if (!Constructor) return
    const instance = new Constructor()
    instance.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
    setListening(false)
    setTranscript('')
    setError(null)
    instance.interimResults = true
    instance.continuous = false
    instance.onstart = () => setListening(true)
    instance.onresult = event => setTranscript(Array.from(event.results, result => result[0]?.transcript ?? '').join(' ').trim())
    instance.onerror = event => {
      active.current = false
      setListening(false)
      if (event.error !== 'aborted') setError(event.error)
    }
    instance.onend = () => {
      active.current = false
      setListening(false)
    }
    recognition.current = instance
    return () => {
      instance.onstart = instance.onresult = instance.onerror = instance.onend = null
      instance.abort()
      active.current = false
      recognition.current = null
    }
  }, [language])

  const start = useCallback(() => {
    const instance = recognition.current
    if (!instance) { setError('unsupported'); return }
    if (active.current) return
    setTranscript('')
    setError(null)
    active.current = true
    try { instance.start() }
    catch { active.current = false; setListening(false); setError('start-failed') }
  }, [])

  const stop = useCallback(() => {
    if (!recognition.current || !active.current) return
    try { recognition.current.stop() }
    catch { active.current = false; setListening(false) }
  }, [])

  return { isSupported, listening, transcript, start, stop, error }
}
