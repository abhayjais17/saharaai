import type { ApiError, FormAnalysis, IntentResult, Language, MessageExplanation } from './types'
import { getMockBill, getMockForm, getMockScam, getMockWebsiteForm, mockDetectIntent } from './mock'
import { t } from './i18n'
import { isFormAnalysis, isIntentResult, isMessageExplanation } from './api-guards'

const error = (code: string, message: string): ApiError => ({ error: code, message_hindi: message })

async function request<T>(path: string, body: unknown, mock: () => T, validate: (value: unknown) => value is T, language: Language): Promise<T> {
  if (process.env.NEXT_PUBLIC_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.floor(Math.random() * 1001)))
    return structuredClone(mock())
  }
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 25000)
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    })
    const data: unknown = await response.json().catch(() => null)
    if (!response.ok) {
      if (data && typeof data === 'object' && 'error' in data && 'message_hindi' in data && typeof data.error === 'string' && typeof data.message_hindi === 'string') {
        throw error(data.error, data.message_hindi)
      }
      throw error(`HTTP_${response.status}`, t('api.unavailable', language))
    }
    if (!validate(data)) throw error('INVALID_RESPONSE', t('api.invalidResponse', language))
    return data
  } catch (cause) {
    if (cause && typeof cause === 'object' && 'message_hindi' in cause) throw cause
    throw error(controller.signal.aborted ? 'TIMEOUT' : 'NETWORK_ERROR',
      t(controller.signal.aborted ? 'api.timeout' : 'api.network', language))
  } finally {
    clearTimeout(timeout)
  }
}

export function detectIntent(transcript: string, language: Language): Promise<IntentResult> {
  return request('/api/intent', { transcript, language }, () => mockDetectIntent(transcript, language), isIntentResult, language)
}

export function analyzeForm(imageBase64: string, language: Language): Promise<FormAnalysis> {
  return request('/api/analyze-form', { imageBase64, language }, () => getMockForm(language), isFormAnalysis, language)
}

function mockMessage(input: { imageBase64?: string; text?: string }, language: Language): MessageExplanation {
  let content = input.text ?? ''
  const image = input.imageBase64 ?? ''
  if (/sample-scam-sms\.svg(?:$|[?#])/.test(image)) return getMockScam(language)
  // Inspect visible demo text, never font/image bytes; arbitrary photos need the backend.
  if (image.startsWith('data:image/svg+xml')) {
    try {
      const [header, ...body] = image.split(',')
      const svg = header.includes(';base64')
        ? new TextDecoder().decode(Uint8Array.from(atob(body.join(',')), char => char.charCodeAt(0)))
        : decodeURIComponent(body.join(','))
      content += svg.replace(/<defs[\s\S]*?<\/defs>/gi, '').replace(/<[^>]+>/g, ' ')
    } catch { /* An unreadable demo image uses the default bill fixture. */ }
  }
  return /kyc|otp|blocked|scam|ओटीपी|संदिग्ध/i.test(content) ? getMockScam(language) : getMockBill(language)
}

export function explainMessage(input: { imageBase64?: string; text?: string }, language: Language): Promise<MessageExplanation> {
  return request('/api/explain-message', { ...input, language }, () => mockMessage(input, language), isMessageExplanation, language)
}

export function analyzeWebsite(input: { url?: string; imageBase64?: string }, language: Language): Promise<FormAnalysis> {
  return request('/api/analyze-website', { ...input, language }, () => getMockWebsiteForm(language), isFormAnalysis, language)
}
