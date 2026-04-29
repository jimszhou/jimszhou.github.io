'use client'

import Link from 'next/link'
import { useVisitorStats } from '@/hooks/useVisitorStats'

interface StatsBoxProps {
  notesCount: number
  lastCommit?: string
}

export function StatsBox({ notesCount, lastCommit }: StatsBoxProps) {
  const { totalVisits, uniqueCountries, loading } = useVisitorStats()

  const stats = [
    { label: 'visits (total)', value: loading ? '—' : String(totalVisits) },
    { label: 'countries', value: loading ? '—' : String(uniqueCountries) },
    { label: 'notes published', value: String(notesCount) },
    { label: 'last commit', value: lastCommit ?? 'recent' },
  ]

  return (
    <Link href="/stats" style={{ display: 'block' }}>
      {stats.map((s) => (
        <div className="tui-stat" key={s.label}>
          <div className="tui-stat-val">{s.value}</div>
          <div className="tui-stat-lbl">{s.label}</div>
        </div>
      ))}
    </Link>
  )
}
