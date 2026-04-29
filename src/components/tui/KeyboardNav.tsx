'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface NavItem {
  key: string
  href: string
}

export function KeyboardNav({ items, githubUrl }: { items: NavItem[]; githubUrl?: string }) {
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return

      const match = items.find((i) => i.key === e.key)
      if (match) {
        e.preventDefault()
        router.push(match.href)
        return
      }

      if (e.key === 'g' && githubUrl) {
        e.preventDefault()
        window.open(githubUrl, '_blank', 'noopener,noreferrer')
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [items, githubUrl, router])

  return null
}
