'use client'

import { useEffect } from 'react'
import { getDb } from '@/lib/firebase'
import { ref, runTransaction } from 'firebase/database'

const DEDUP_KEY = 'visitor_logged_at'
const LOCATION_KEY = 'visitor_location'
const DEDUP_TTL = 24 * 60 * 60 * 1000 // 24 hours

function sanitizeKey(s: string): string {
  return s.replace(/[.#$\[\]\/]/g, '_')
}

export default function VisitorTracker() {
  useEffect(() => {
    const lastLogged = localStorage.getItem(DEDUP_KEY)
    if (lastLogged && Date.now() - Number(lastLogged) < DEDUP_TTL) return

    const db = getDb()
    if (!db) return

    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data.latitude && data.longitude) {
          const city = data.city || 'Unknown'
          const country = data.country_name || 'Unknown'
          const key = sanitizeKey(`${city}-${country}`)
          const locationRef = ref(db, `visitors/${key}`)

          runTransaction(locationRef, (current) => {
            if (current) {
              return { ...current, count: current.count + 1, lastVisit: Date.now() }
            }
            return {
              lat: data.latitude,
              lng: data.longitude,
              city,
              country,
              count: 1,
              lastVisit: Date.now(),
            }
          })

          localStorage.setItem(DEDUP_KEY, String(Date.now()))
          localStorage.setItem(LOCATION_KEY, JSON.stringify({ city, country }))
        }
      })
      .catch(() => {
        // Geo lookup failed — that's OK
      })
  }, [])

  return null
}
