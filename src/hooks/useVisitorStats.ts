'use client'

import { useEffect, useState } from 'react'
import { getDb } from '@/lib/firebase'
import { ref, onValue } from 'firebase/database'

interface AggregatedVisitor {
  lat: number
  lng: number
  city: string
  country: string
  count: number
  lastVisit: number
}

export function useVisitorStats() {
  const [visitors, setVisitors] = useState<AggregatedVisitor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const db = getDb()
    if (!db) {
      setLoading(false)
      return
    }

    const visitorsRef = ref(db, 'visitors')

    const unsubscribe = onValue(visitorsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const entries: AggregatedVisitor[] = Object.values(data)
        setVisitors(entries)
      } else {
        setVisitors([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const totalVisits = visitors.reduce((sum, v) => sum + v.count, 0)
  const uniqueLocations = visitors.length
  const uniqueCountries = new Set(visitors.map((v) => v.country)).size

  return { visitors, totalVisits, uniqueLocations, uniqueCountries, loading }
}

export type { AggregatedVisitor }
