'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLanguage } from '@/components/LanguageProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { detectIntent } from '@/lib/api'
import { EASE } from '@/lib/motion'

export function HomePrompt() {
  const [expanded, setExpanded] = useState(false)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const [failed, setFailed] = useState(false)
  const request = useRef(0)
  const { t, language } = useLanguage()
  const router = useRouter()
  const reduced = useReducedMotion()
  useEffect(() => () => { request.current += 1 }, [])

  async function submit() {
    if (!text.trim() || busy) return
    const current = ++request.current
    setBusy(true)
    setNote('')
    setFailed(false)
    try {
      const result = await detectIntent(text.trim(), language)
      if (current !== request.current) return
      const routes = { form_scan: '/form', explain_message: '/message', website_form: '/website' } as const
      if (result.intent === 'unknown') setNote(result.reply_hindi)
      else router.push(routes[result.intent])
    } catch (error) {
      if (current !== request.current) return
      setFailed(true)
      setNote(error && typeof error === 'object' && 'message_hindi' in error && typeof error.message_hindi === 'string' ? error.message_hindi : t('api.unavailable'))
    } finally {
      if (current === request.current) setBusy(false)
    }
  }

  return (
    <div className="flex min-w-0 flex-col items-center lg:col-start-1 lg:row-start-2 lg:items-start lg:self-start">
      <button type="button" aria-expanded={expanded} aria-controls="home-text-form" onClick={() => setExpanded(value => !value)} className="min-h-[48px] cursor-pointer rounded-[12px] px-4 text-[18px] lg:px-0 text-on-dark underline decoration-on-dark-muted/50 underline-offset-4 focus-visible:outline-mint">
        {t('home.typeInstead')}
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div id="home-text-form" className="w-full max-w-[520px] overflow-hidden" initial={{ height: reduced ? 'auto' : 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: reduced ? 'auto' : 0, opacity: 0 }} transition={{ duration: 0.24, ease: EASE }}>
            <form aria-busy={busy} onSubmit={event => { event.preventDefault(); void submit() }} className="px-1 pb-1 pt-4">
              <FieldGroup>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="home-request" className="sr-only">{t('home.typePlaceholder')}</FieldLabel>
                  <Input id="home-request" autoFocus autoComplete="off" maxLength={500} placeholder={t('home.typePlaceholder')} value={text} aria-describedby="home-request-status" onChange={event => { setText(event.target.value); setNote(''); setFailed(false) }} onKeyDown={event => { if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault() }} />
                  <Button type="submit" variant="hero" size="touch" disabled={busy || !text.trim()}>{t(failed ? 'common.tryAgain' : 'home.send')}</Button>
                </Field>
              </FieldGroup>
              <p id="home-request-status" role="status" aria-live="polite" className="mt-2 text-[16px] leading-relaxed text-on-dark-muted">{busy ? t('common.loading') : note}</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
