import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { MOCK_FORM_HI as MOCK_FORM, MOCK_WEBSITE_FORM_HI as MOCK_WEBSITE_FORM, MOCK_BILL_HI as MOCK_BILL, MOCK_SCAM_HI as MOCK_SCAM, MOCK_BILL_SMS, MOCK_SCAM_SMS, mockDetectIntent, getMockForm, getMockWebsiteForm, getMockBill, getMockScam } from '../lib/mock'
import { dictionary, t } from '../lib/i18n'
import { isFormAnalysis, isMessageExplanation, isIntentResult } from '../lib/api-guards'
import { get, set, remove, clearSaharaStorage } from '../lib/storage'
import { analyzeForm, analyzeWebsite, detectIntent, explainMessage } from '../lib/api'

const sample = (name: string) => readFileSync(new URL(`../public/mock/${name}`, import.meta.url), 'utf8')

test('all fixtures match the API contract', () => {
  assert.ok(isFormAnalysis(MOCK_FORM))
  assert.ok(isFormAnalysis(MOCK_WEBSITE_FORM))
  assert.ok(isMessageExplanation(MOCK_BILL))
  assert.ok(isMessageExplanation(MOCK_SCAM))
  assert.ok(MOCK_WEBSITE_FORM.fields.every(field => field.box === null))
  assert.equal(MOCK_FORM.fields.length, 10)
  assert.equal(MOCK_WEBSITE_FORM.fields.length, 6)
  assert.equal(isFormAnalysis({ ...MOCK_FORM, total_fields: 9 }), false)
  assert.equal(isMessageExplanation({ summary_hindi: 'अधूरा जवाब' }), false)
})

test('all ten normalized boxes match the exact sample SVG rectangles', () => {
  const svg = sample('sample-form.svg')
  for (const field of MOCK_FORM.fields) {
    const rect = svg.match(new RegExp(`<rect id="field-${field.id}" x="(\\d+)" y="(\\d+)" width="(\\d+)" height="(\\d+)"`))
    assert.ok(rect, `Missing SVG rectangle for field ${field.id}`)
    assert.deepEqual(field.box, { x: Number(rect[1]) / 800, y: Number(rect[2]) / 1100, w: Number(rect[3]) / 800, h: Number(rect[4]) / 1100 })
  }
})

test('SMS SVG bubbles preserve exact sample text', () => {
  for (const [file, raw] of [['sample-bill-sms.svg', MOCK_BILL_SMS], ['sample-scam-sms.svg', MOCK_SCAM_SMS]]) {
    const text = [...sample(file).matchAll(/<tspan[^>]*>([^<]*)<\/tspan>/g)].map(match => match[1]).join(' ')
    assert.equal(text, raw)
  }
})

test('Hindi, English, mixed-intent and unknown detection', () => {
  const cases = [['फ़ॉर्म', 'form_scan'], ['फॉर्म', 'form_scan'], ['FORM', 'form_scan'], ['बिल', 'explain_message'], ['मैसेज', 'explain_message'], ['SMS', 'explain_message'], ['message', 'explain_message'], ['वेबसाइट फ़ॉर्म', 'website_form'], ['website', 'website_form'], ['portal', 'website_form'], ['पोर्टल', 'website_form'], ['', 'unknown']]
  for (const [text, intent] of cases) {
    for (const language of ['en', 'hi'] as const) {
      const result = mockDetectIntent(text, language)
      assert.equal(result.intent, intent)
      assert.ok(isIntentResult(result))
      assert.equal(/[\u0900-\u097f]/u.test(result.reply_hindi), language === 'hi')
    }
  }
})

test('both languages have complete dictionaries and equivalent fixture geometry', () => {
  assert.deepEqual(Object.keys(dictionary.en).sort(), Object.keys(dictionary.hi).sort())
  assert.equal(t('foundation.ready'), 'Foundation ready')
  assert.equal(t('foundation.ready', 'hi'), 'बुनियाद तैयार है')
  for (const language of ['en', 'hi'] as const) {
    const form = getMockForm(language)
    const website = getMockWebsiteForm(language)
    assert.ok(isFormAnalysis(form))
    assert.ok(isFormAnalysis(website))
    assert.ok(isMessageExplanation(getMockBill(language)))
    assert.ok(isMessageExplanation(getMockScam(language)))
    assert.deepEqual(form.fields.map(field => field.box), MOCK_FORM.fields.map(field => field.box))
    assert.ok(website.fields.every(field => field.box === null))
    if (language === 'en') {
      assert.equal(/[\u0900-\u097f]/u.test(JSON.stringify([form, website, getMockBill(language), getMockScam(language)])), false)
    }
    form.fields[0].label = 'Changed'
    assert.notEqual(getMockForm(language).fields[0].label, 'Changed')
  }
  assert.equal(mockDetectIntent('electricity bill', 'en').intent, 'explain_message')
})

test('English mock adapters return English fields, explanations and intent replies', async () => {
  const previous = process.env.NEXT_PUBLIC_USE_MOCK
  delete process.env.NEXT_PUBLIC_USE_MOCK
  try {
    const [form, website, intent, bill, scam] = await Promise.all([
      analyzeForm('sample', 'en'), analyzeWebsite({ url: 'https://example.gov.in' }, 'en'),
      detectIntent('form', 'en'), explainMessage({ text: MOCK_BILL_SMS }, 'en'),
      explainMessage({ imageBase64: '/mock/sample-scam-sms.svg' }, 'en'),
    ])
    assert.deepEqual(form, getMockForm('en'))
    assert.deepEqual(website, getMockWebsiteForm('en'))
    assert.deepEqual(intent, mockDetectIntent('form', 'en'))
    assert.deepEqual(bill, getMockBill('en'))
    assert.deepEqual(scam, getMockScam('en'))
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_USE_MOCK
    else process.env.NEXT_PUBLIC_USE_MOCK = previous
  }
})

test('storage is SSR-safe and never throws', () => {
  assert.equal(get('sahara.profile'), null)
  assert.deepEqual(get('sahara.profile', { name: '' }), { name: '' })
  assert.equal(set('sahara.profile', {}), false)
  assert.equal(remove('sahara.profile'), false)
  assert.equal(clearSaharaStorage(), false)
})

test('mock adapters delay, select examples and return isolated copies', async () => {
  const previous = process.env.NEXT_PUBLIC_USE_MOCK
  delete process.env.NEXT_PUBLIC_USE_MOCK
  try {
    const start = Date.now()
    const [form, website, intent, bill, scam, scamImage, billImage] = await Promise.all([
      analyzeForm('sample', 'hi'), analyzeWebsite({ url: 'https://example.gov.in' }, 'hi'), detectIntent('फ़ॉर्म', 'hi'),
      explainMessage({ text: MOCK_BILL_SMS }, 'hi'), explainMessage({ text: MOCK_SCAM_SMS }, 'hi'),
      explainMessage({ imageBase64: `data:image/svg+xml;base64,${Buffer.from(sample('sample-scam-sms.svg')).toString('base64')}` }, 'hi'),
      explainMessage({ imageBase64: `data:image/svg+xml;base64,${Buffer.from(sample('sample-bill-sms.svg')).toString('base64')}` }, 'hi'),
    ])
    assert.ok(Date.now() - start >= 1200)
    assert.deepEqual(form, MOCK_FORM)
    assert.deepEqual(website, MOCK_WEBSITE_FORM)
    assert.equal(intent.intent, 'form_scan')
    assert.deepEqual(bill, MOCK_BILL)
    assert.deepEqual(scam, MOCK_SCAM)
    assert.deepEqual(scamImage, MOCK_SCAM)
    assert.deepEqual(billImage, MOCK_BILL)
    form.fields[0].label = 'Changed'
    assert.equal(MOCK_FORM.fields[0].label, 'नाम')
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_USE_MOCK
    else process.env.NEXT_PUBLIC_USE_MOCK = previous
  }
})

test('real mode POST contract, backend errors, invalid JSON and network failures', async () => {
  const previousMode = process.env.NEXT_PUBLIC_USE_MOCK
  const originalFetch = globalThis.fetch
  process.env.NEXT_PUBLIC_USE_MOCK = 'false'
  const calls: { url: string; body: unknown }[] = []
  try {
    globalThis.fetch = async (url, init) => {
      assert.equal(init?.method, 'POST')
      assert.equal((init?.headers as Record<string, string>)['Content-Type'], 'application/json')
      calls.push({ url: String(url), body: JSON.parse(String(init?.body)) })
      const data = String(url).endsWith('/intent') ? mockDetectIntent('form', 'en') : String(url).endsWith('/explain-message') ? getMockBill('en') : getMockForm('en')
      return Response.json(data)
    }
    for (const language of ['en', 'hi'] as const) {
      await detectIntent('form', language)
      await analyzeForm('image', language)
      await explainMessage({ text: 'bill' }, language)
      await analyzeWebsite({ url: 'https://example.gov.in' }, language)
    }
    assert.deepEqual(calls, ['en', 'hi'].flatMap(language => [
      { url: '/api/intent', body: { transcript: 'form', language } },
      { url: '/api/analyze-form', body: { imageBase64: 'image', language } },
      { url: '/api/explain-message', body: { text: 'bill', language } },
      { url: '/api/analyze-website', body: { url: 'https://example.gov.in', language } },
    ]))
    globalThis.fetch = async () => Response.json({ error: 'UNREADABLE', message_hindi: 'दूसरी फ़ोटो चुनिए।' }, { status: 422 })
    await assert.rejects(analyzeForm('bad', 'hi'), { error: 'UNREADABLE', message_hindi: 'दूसरी फ़ोटो चुनिए।' })
    for (const language of ['en', 'hi'] as const) {
      globalThis.fetch = async () => new Response('not-json', { status: 200 })
      await assert.rejects(analyzeForm('bad', language), { error: 'INVALID_RESPONSE', message_hindi: t('api.invalidResponse', language) })
      globalThis.fetch = async () => new Response('unavailable', { status: 503 })
      await assert.rejects(analyzeForm('bad', language), { error: 'HTTP_503', message_hindi: t('api.unavailable', language) })
      globalThis.fetch = async () => { throw new TypeError('network unavailable') }
      await assert.rejects(analyzeForm('bad', language), { error: 'NETWORK_ERROR', message_hindi: t('api.network', language) })
    }
  } finally {
    globalThis.fetch = originalFetch
    if (previousMode === undefined) delete process.env.NEXT_PUBLIC_USE_MOCK
    else process.env.NEXT_PUBLIC_USE_MOCK = previousMode
  }
})
