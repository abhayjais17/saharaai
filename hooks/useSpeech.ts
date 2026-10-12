'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { get, STORAGE_EVENT } from '@/lib/storage'
import type { Language } from '@/lib/types'

type SpeechSettings = { muted?: boolean; rate?: number }
type SpeechOptions = { rate?: number; muted?: boolean }

export function useSpeech(language: Language, options: SpeechOptions = {}) {
  const [speaking, setSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const current = useRef<SpeechSynthesisUtterance | null>(null)
  const optionsRef = useRef(options)
  optionsRef.current = options

  const cancel = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    if (current.current) {
      current.current.onstart = current.current.onend = current.current.onerror = null
      current.current = null
      window.speechSynthesis.cancel()
    }
    setSpeaking(false)
  }, [])

  useEffect(() => {
    setIsSupported('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window)
    const onSettings = () => {
      if (get<SpeechSettings>('sahara.settings')?.muted) cancel()
    }
    window.addEventListener(STORAGE_EVENT, onSettings)
    window.addEventListener('storage', onSettings)
    return () => {
      window.removeEventListener(STORAGE_EVENT, onSettings)
      window.removeEventListener('storage', onSettings)
      if (current.current) {
        current.current.onstart = current.current.onend = current.current.onerror = null
        window.speechSynthesis.cancel()
        current.current = null
      }
    }
  }, [cancel])

  useEffect(() => { if (options.muted) cancel() }, [options.muted, cancel])
  useEffect(() => { cancel() }, [language, cancel])

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return
    const settings = get<SpeechSettings>('sahara.settings')
    if (optionsRef.current.muted || settings?.muted || !text.trim()) return
    cancel()
    const synth = window.speechSynthesis
    const locale = language === 'hi' ? 'hi-IN' : 'en-IN'
    const voices = synth.getVoices()
    const voice = voices.find(item => item.lang.replace('_', '-').toLowerCase() === locale.toLowerCase())
      ?? voices.find(item => item.lang.toLowerCase().split(/[-_]/)[0] === language)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = locale
    if (voice) utterance.voice = voice
    const rate = optionsRef.current.rate ?? settings?.rate ?? 0.95
    utterance.rate = typeof rate === 'number' && Number.isFinite(rate) ? Math.min(1.5, Math.max(0.5, rate)) : 0.95
    const finish = () => {
      if (current.current !== utterance) return
      current.current = null
      setSpeaking(false)
    }
    utterance.onstart = () => { if (current.current === utterance) setSpeaking(true) }
    utterance.onend = utterance.onerror = finish
    current.current = utterance
    try {
      synth.cancel()
      synth.speak(utterance)
    } catch { finish() }
  }, [cancel, language])

  return { isSupported, speak, cancel, speaking }
}
