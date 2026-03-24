'use client'

import { useEffect, useState, memo } from 'react'
import { worldMapPath } from '@/data/worldMapPaths'
import { getDb } from '@/lib/firebase'
import { ref, onValue, runTransaction } from 'firebase/database'

interface AggregatedVisitor {
  lat: number
  lng: number
  city: string
  country: string
  count: number
  lastVisit: number
}

// Mercator projection constants
// Full projection maps to 960×480; the viewBox crops to the visible region.
const MAP_W = 960
const MAP_FULL_H = 480
// Crop: show y from VIEW_Y to VIEW_Y+VIEW_H (cuts empty Arctic/Antarctic)
const VIEW_Y = 5
const VIEW_H = 420

function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * MAP_W
  const latRad = (lat * Math.PI) / 180
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
  const y = MAP_FULL_H / 2 - (mercN * MAP_W) / (2 * Math.PI)
  return { x, y: Math.max(0, Math.min(MAP_FULL_H, y)) }
}

// Sanitize string for use as a Firebase RTDB key
function sanitizeKey(s: string): string {
  return s.replace(/[.#$\[\]\/]/g, '_')
}

export function VisitorMap() {
  const [visitors, setVisitors] = useState<AggregatedVisitor[]>([])
  const [currentVisitor, setCurrentVisitor] = useState<{ city: string; country: string } | null>(null)
  const [tooltip, setTooltip] = useState<{ visitor: AggregatedVisitor; x: number; y: number } | null>(null)

  useEffect(() => {
    const db = getDb()
    if (!db) return

    const visitorsRef = ref(db, 'visitors')

    // Listen for realtime updates from Firebase
    const unsubscribe = onValue(visitorsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const entries: AggregatedVisitor[] = Object.values(data)
        setVisitors(entries)
      } else {
        setVisitors([])
      }
    })

    // Record current visitor (once per session)
    const alreadyLogged = sessionStorage.getItem('visitor_logged')

    if (!alreadyLogged) {
      fetch('https://ipapi.co/json/')
        .then((res) => res.json())
        .then((data) => {
          if (data.latitude && data.longitude) {
            const city = data.city || 'Unknown'
            const country = data.country_name || 'Unknown'
            const key = sanitizeKey(`${city}-${country}`)
            const locationRef = ref(db, `visitors/${key}`)

            setCurrentVisitor({ city, country })

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

            sessionStorage.setItem('visitor_logged', 'true')
          }
        })
        .catch(() => {
          // Geo lookup failed — that's OK
        })
    }

    return () => unsubscribe()
  }, [])

  const totalVisits = visitors.reduce((sum, v) => sum + v.count, 0)
  const uniqueCountries = new Set(visitors.map((v) => v.country)).size

  return (
    <div className="border border-gray-800 rounded-xl p-4 sm:p-6 overflow-hidden">
      {/* SVG World Map */}
      <div className="relative">
        <svg
          viewBox={`0 ${VIEW_Y} ${MAP_W} ${VIEW_H}`}
          className="w-full h-auto"
          style={{ background: 'transparent' }}
        >
          {/* Simplified world map outline */}
          <WorldOutline />

          {/* Visitor dots */}
          {visitors.map((visitor, i) => {
            const { x, y } = project(visitor.lat, visitor.lng)
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={Math.min(3 + visitor.count, 8)}
                  fill="rgba(20, 184, 166, 0.6)"
                  stroke="rgb(20, 184, 166)"
                  strokeWidth={1}
                  className="cursor-pointer"
                  onMouseEnter={(e) => {
                    const rect = (e.target as SVGElement).closest('svg')!.getBoundingClientRect()
                    const svgX = (x / MAP_W) * rect.width + rect.left
                    const svgY = ((y - VIEW_Y) / VIEW_H) * rect.height + rect.top
                    setTooltip({ visitor, x: svgX, y: svgY })
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
                {/* Pulse animation for current visitor */}
                {currentVisitor &&
                  visitor.city === currentVisitor.city &&
                  visitor.country === currentVisitor.country && (
                    <circle
                      cx={x}
                      cy={y}
                      r={Math.min(3 + visitor.count, 8)}
                      fill="none"
                      stroke="rgb(20, 184, 166)"
                      strokeWidth={1.5}
                      opacity={0.6}
                    >
                      <animate
                        attributeName="r"
                        from={String(Math.min(3 + visitor.count, 8))}
                        to={String(Math.min(3 + visitor.count, 8) + 8)}
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 px-3 py-2 bg-gray-800 text-gray-200 text-xs rounded-lg shadow-lg pointer-events-none"
            style={{ left: tooltip.x, top: tooltip.y - 40 }}
          >
            <div className="font-medium">{tooltip.visitor.city}, {tooltip.visitor.country}</div>
            <div className="text-gray-400">{tooltip.visitor.count} visits</div>
          </div>
        )}
      </div>

      {/* Stats summary */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
        <div>
          <span className="text-teal-400 font-semibold">{totalVisits}</span> visits recorded
        </div>
        <div>
          <span className="text-teal-400 font-semibold">{visitors.length}</span> unique locations
        </div>
        <div>
          <span className="text-teal-400 font-semibold">{uniqueCountries}</span> countries
        </div>
      </div>

      {/* Visitor locations list */}
      {visitors.length > 0 && (
        <div className="mt-4 border-t border-gray-800 pt-4">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Visitor Locations</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[...visitors]
              .sort((a, b) => b.count - a.count)
              .slice(0, 12)
              .map((visitor) => (
                <div
                  key={`${visitor.city}-${visitor.country}`}
                  className="text-xs text-gray-400 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                  <span className="truncate">
                    {visitor.city}, {visitor.country}
                  </span>
                  <span className="text-gray-600 ml-auto">{visitor.count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-gray-600 mt-4">
        Visitor locations are aggregated anonymously. Only city-level data is stored.
      </p>
    </div>
  )
}

/**
 * Accurate world map outline from Natural Earth 110m data.
 * Pre-projected to Mercator; viewBox crops to the visible region.
 * Memoized since the path data never changes.
 */
const WorldOutline = memo(function WorldOutline() {
  return (
    <g>
      {/* Grid lines */}
      {[-60, -30, 0, 30, 60].map((lat) => {
        const { y } = project(lat, 0)
        return (
          <line
            key={`lat-${lat}`}
            x1={0}
            y1={y}
            x2={MAP_W}
            y2={y}
            stroke="rgb(31, 41, 55)"
            strokeWidth={0.3}
            strokeDasharray="4,4"
          />
        )
      })}
      {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lng) => {
        const { x } = project(0, lng)
        return (
          <line
            key={`lng-${lng}`}
            x1={x}
            y1={VIEW_Y}
            x2={x}
            y2={VIEW_Y + VIEW_H}
            stroke="rgb(31, 41, 55)"
            strokeWidth={0.3}
            strokeDasharray="4,4"
          />
        )
      })}
      {/* Land masses from Natural Earth 110m */}
      <path
        d={worldMapPath}
        fill="rgb(31, 41, 55)"
        stroke="rgb(55, 65, 81)"
        strokeWidth={0.5}
      />
    </g>
  )
})
