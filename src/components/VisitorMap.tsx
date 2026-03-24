'use client'

import { useEffect, useState } from 'react'
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

// Simple Mercator projection for the SVG map (960x480 viewBox)
function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 960
  const latRad = (lat * Math.PI) / 180
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
  const y = 240 - (mercN * 960) / (2 * Math.PI)
  return { x, y: Math.max(0, Math.min(480, y)) }
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
          viewBox="0 0 960 480"
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
                    const svgX = (x / 960) * rect.width + rect.left
                    const svgY = (y / 480) * rect.height + rect.top
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
 * Simplified SVG world map outlines
 * Using a minimal set of path data for major landmasses
 */
function WorldOutline() {
  return (
    <g fill="none" stroke="rgb(55, 65, 81)" strokeWidth={0.5}>
      {/* Grid lines */}
      {[-60, -30, 0, 30, 60].map((lat) => {
        const { y } = project(lat, 0)
        return (
          <line
            key={`lat-${lat}`}
            x1={0}
            y1={y}
            x2={960}
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
            y1={0}
            x2={x}
            y2={480}
            stroke="rgb(31, 41, 55)"
            strokeWidth={0.3}
            strokeDasharray="4,4"
          />
        )
      })}
      {/* Simplified continent outlines */}
      <g fill="rgb(31, 41, 55)" stroke="rgb(55, 65, 81)" strokeWidth={0.5}>
        {/* North America */}
        <path d="M130,85 L155,80 L175,90 L195,85 L215,90 L230,100 L240,115 L245,130 L250,145 L260,155 L265,165 L270,175 L275,180 L270,190 L260,195 L250,200 L240,210 L230,215 L220,220 L210,225 L200,225 L190,220 L185,225 L175,230 L165,230 L155,225 L150,220 L145,210 L140,200 L138,195 L135,190 L130,180 L125,170 L120,160 L115,150 L110,140 L105,130 L108,120 L115,110 L120,100 L125,90 Z" />
        {/* South America */}
        <path d="M220,260 L235,255 L250,258 L265,265 L275,275 L280,290 L282,305 L280,320 L275,335 L270,350 L262,365 L255,375 L248,385 L240,390 L232,388 L225,380 L220,370 L218,360 L215,345 L212,330 L210,315 L208,300 L210,285 L212,270 Z" />
        {/* Europe */}
        <path d="M440,90 L455,85 L470,88 L480,95 L490,100 L500,105 L510,108 L520,115 L515,125 L510,135 L505,140 L500,145 L495,150 L488,155 L480,160 L470,162 L460,158 L452,155 L445,150 L438,145 L435,140 L433,135 L430,125 L432,115 L435,105 L438,95 Z" />
        {/* Africa */}
        <path d="M450,170 L465,168 L480,170 L495,175 L510,180 L520,190 L528,205 L532,220 L535,240 L533,260 L530,280 L525,295 L518,310 L510,320 L500,328 L490,332 L480,330 L470,322 L462,310 L458,295 L455,280 L452,260 L450,240 L448,220 L446,200 L445,185 Z" />
        {/* Asia */}
        <path d="M520,80 L545,75 L570,72 L600,70 L630,68 L660,70 L690,75 L720,80 L740,85 L755,90 L770,100 L780,110 L785,120 L790,135 L785,150 L780,160 L770,170 L755,178 L740,182 L725,185 L710,188 L695,190 L680,188 L665,185 L650,180 L638,178 L625,175 L610,170 L600,165 L590,160 L575,155 L560,150 L548,145 L538,140 L530,132 L525,120 L520,110 L518,95 Z" />
        {/* Australia */}
        <path d="M720,295 L740,290 L760,292 L778,298 L790,308 L795,320 L792,335 L785,345 L775,352 L760,355 L745,352 L732,345 L722,335 L718,320 L716,308 Z" />
        {/* Greenland */}
        <path d="M285,50 L305,45 L320,48 L330,55 L332,65 L328,75 L318,80 L305,82 L292,78 L282,70 L280,60 Z" />
      </g>
    </g>
  )
}
