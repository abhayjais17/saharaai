import { get, set } from './storage'
import { t } from './i18n'
import type { Language } from './types'

export const RECENT_KEY = 'sahara.recent'
export const TASK_ROUTES = { form: '/form', message: '/message', website: '/website' } as const
export type TaskType = keyof typeof TASK_ROUTES
export interface RecentTask { id: string; type: TaskType; title: string; createdAt: number }

function isRecentTask(value: unknown): value is RecentTask {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<RecentTask>
  return typeof item.id === 'string' && typeof item.title === 'string' && item.title.trim().length > 0
    && typeof item.type === 'string' && Object.hasOwn(TASK_ROUTES, item.type)
    && typeof item.createdAt === 'number' && Number.isFinite(item.createdAt)
    && !Number.isNaN(new Date(item.createdAt).getTime())
}

export function getRecent(): RecentTask[] {
  const stored = get<unknown>(RECENT_KEY)
  return Array.isArray(stored) ? stored.filter(isRecentTask).sort((a, b) => b.createdAt - a.createdAt).slice(0, 3) : []
}

export function addRecent({ type, title }: { type: TaskType; title: string }): boolean {
  if (!Object.hasOwn(TASK_ROUTES, type) || !title.trim()) return false
  const createdAt = Date.now()
  const item = { id: `${type}-${createdAt}`, type, title: title.trim().slice(0, 200), createdAt }
  return set(RECENT_KEY, [item, ...getRecent().filter(previous => previous.type !== type || previous.title !== item.title)].slice(0, 3))
}

export function recentDate(timestamp: number, language: Language, now = new Date()): string {
  const date = new Date(timestamp)
  if (date.toDateString() === now.toDateString()) return t('home.today', language)
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return t('home.yesterday', language)
  return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short' }).format(date)
}
