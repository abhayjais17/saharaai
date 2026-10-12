import { test } from 'node:test'
import assert from 'node:assert/strict'
import { addRecent, getRecent, recentDate, RECENT_KEY, TASK_ROUTES } from '../lib/recent'
import { set } from '../lib/storage'
import { dictionary } from '../lib/i18n'

function withStorage(run: (values: Map<string, string>) => void) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const values = new Map<string, string>()
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    localStorage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) },
    dispatchEvent: () => true,
  } })
  try { run(values) } finally {
    if (descriptor) Object.defineProperty(globalThis, 'window', descriptor)
    else Reflect.deleteProperty(globalThis, 'window')
  }
}

test('recent tasks are SSR safe and tolerate inaccessible storage', () => {
  assert.deepEqual(getRecent(), [])
  assert.equal(addRecent({ type: 'form', title: 'Sample form' }), false)
  withStorage(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('unavailable') } })
    assert.deepEqual(getRecent(), [])
    assert.equal(addRecent({ type: 'form', title: 'Sample form' }), false)
  })
})

test('recent tasks validate stored data and keep the latest three', () => {
  withStorage(values => {
    values.set(RECENT_KEY, 'broken JSON')
    assert.deepEqual(getRecent(), [])
    set(RECENT_KEY, { invalid: true })
    assert.deepEqual(getRecent(), [])
    set(RECENT_KEY, [
      { id: 'one', type: 'form', title: 'One', createdAt: 1 },
      { id: 'bad', type: '__proto__', title: 'Wrong route', createdAt: 10 },
      { id: 'bad-date', type: 'form', title: 'Wrong date', createdAt: 1e30 },
      { id: 'four', type: 'website', title: 'Four', createdAt: 4 },
      { id: 'two', type: 'message', title: 'Two', createdAt: 2 },
      { id: 'three', type: 'form', title: 'Three', createdAt: 3 },
      null,
    ])
    assert.deepEqual(getRecent().map(item => item.title), ['Four', 'Three', 'Two'])
    assert.equal(addRecent({ type: 'form', title: '  New form  ' }), true)
    assert.equal(getRecent()[0].title, 'New form')
    assert.equal(getRecent().length, 3)
    assert.equal(addRecent({ type: 'form', title: 'New form' }), true)
    assert.equal(getRecent().filter(item => item.title === 'New form').length, 1)
    assert.equal(addRecent({ type: 'message', title: ' ' }), false)
    assert.equal(getRecent().length, 3)
  })
})

test('recent dates use local calendar days in both languages', () => {
  const now = new Date(2026, 9, 12, 0, 5)
  assert.equal(recentDate(now.getTime(), 'en', now), 'Today')
  assert.equal(recentDate(now.getTime(), 'hi', now), 'आज')
  const yesterday = new Date(2026, 9, 11, 23, 55)
  assert.equal(recentDate(yesterday.getTime(), 'en', now), 'Yesterday')
  assert.equal(recentDate(yesterday.getTime(), 'hi', now), 'कल')
  assert.match(recentDate(new Date(2026, 9, 1).getTime(), 'en', now), /1/)
})

test('home copy and recent destinations match the task contract', () => {
  assert.deepEqual(TASK_ROUTES, { form: '/form', message: '/message', website: '/website' })
  for (const key of Object.keys(dictionary.en).filter(key => key.startsWith('home.'))) {
    assert.ok(dictionary.hi[key as keyof typeof dictionary.hi])
  }
  assert.equal(dictionary.en['home.greeting'], 'Hello! What would you like to do?')
  assert.equal(dictionary.hi['home.greeting'], 'नमस्ते! आप क्या करना चाहते हैं?')
})
