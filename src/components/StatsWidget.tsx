'use client'

import Link from 'next/link'
import { useVisitorStats } from '@/hooks/useVisitorStats'

export function StatsWidget() {
  const { totalVisits, uniqueLocations, uniqueCountries, loading } = useVisitorStats()

  const stats = [
    { label: 'visits', value: totalVisits },
    { label: 'locations', value: uniqueLocations },
    { label: 'countries', value: uniqueCountries },
  ]

  return (
    <Link
      href="/stats"
      className="group block p-6 border border-gray-800 rounded-xl hover:border-accent/40 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl group-hover:text-accent transition-colors">
          Visitor Reach
        </h3>
        <span className="font-stencil text-xs text-gray-500 group-hover:text-accent transition-colors">
          See full map &rarr;
        </span>
      </div>
      <div className="flex gap-8">
        {stats.map((stat) => (
          <div key={stat.label}>
            <span className="font-display text-3xl text-accent">
              {loading ? '—' : stat.value}
            </span>
            <span className="font-stencil block text-xs text-gray-500 mt-1">{stat.label}</span>
          </div>
        ))}
      </div>
    </Link>
  )
}
