'use client'

import { useEffect } from 'react'
import useSWR from 'swr'
import { getRecent, RECENT_KEY } from '@/lib/recent'
import { STORAGE_EVENT } from '@/lib/storage'

export function useRecent() {
  const { data = [], mutate } = useSWR(RECENT_KEY, getRecent)
  useEffect(() => {
    const sync = () => { void mutate() }
    window.addEventListener(STORAGE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(STORAGE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [mutate])
  return data
}
