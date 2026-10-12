export const STORAGE_EVENT = 'sahara:storage'

export function get<T>(key: string, fallback: T | null = null): T | null {
  if (typeof window === 'undefined') return fallback
  try {
    const value = window.localStorage.getItem(key)
    return value === null ? fallback : JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function set<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false
  try {
    const serialized = JSON.stringify(value)
    if (serialized === undefined) return false
    window.localStorage.setItem(key, serialized)
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }))
    return true
  } catch {
    return false
  }
}

export function remove(key: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    window.localStorage.removeItem(key)
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }))
    return true
  } catch {
    return false
  }
}

export function clearSaharaStorage(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const keys = Object.keys(window.localStorage).filter(key => key.startsWith('sahara.'))
    for (const key of keys) window.localStorage.removeItem(key)
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key: null } }))
    return true
  } catch {
    return false
  }
}

export const storage = { get, set, remove, clear: clearSaharaStorage }
