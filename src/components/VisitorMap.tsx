'use client'

import { useEffect, useState, memo } from 'react'
import { worldMapPath } from '@/data/worldMapPaths'
import { useVisitorStats, type AggregatedVisitor } from '@/hooks/useVisitorStats'

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

export function VisitorMap() {
  const { visitors, totalVisits, uniqueCountries } = useVisitorStats()
  const [currentVisitor, setCurrentVisitor] = useState<{ city: string; country: string } | null>(null)
  const [tooltip, setTooltip] = useState<{ visitor: AggregatedVisitor; x: number; y: number } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('visitor_location')
    if (stored) {
      try {
        setCurrentVisitor(JSON.parse(stored))
      } catch {
        // ignore malformed data
      }
    }
  }, [])

  return (
    <div
      className="rounded-xl p-4 sm:p-6 overflow-hidden"
      style={{ border: '1px solid var(--rule)' }}
    >
      {/* SVG World Map */}
      <div className="relative">
        <svg
          viewBox={`0 ${VIEW_Y} ${MAP_W} ${VIEW_H}`}
          className="w-full h-auto"
          style={{ background: 'transparent' }}
          onClick={() => setTooltip(null)}
        >
          {/* Simplified world map outline */}
          <WorldOutline />

          {/* Visitor dots */}
          {visitors.map((visitor, i) => {
            const { x, y } = project(visitor.lat, visitor.lng)
            const r = Math.min(3 + visitor.count, 8)
            const showTip = (e: React.SyntheticEvent) => {
              const rect = (e.currentTarget as SVGElement).closest('svg')!.getBoundingClientRect()
              const svgX = (x / MAP_W) * rect.width + rect.left
              const svgY = ((y - VIEW_Y) / VIEW_H) * rect.height + rect.top
              setTooltip({ visitor, x: svgX, y: svgY })
            }
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="var(--accent-2)"
                  fillOpacity={0.6}
                  stroke="var(--accent-2)"
                  strokeWidth={1}
                  className="cursor-pointer"
                  onMouseEnter={showTip}
                  onMouseLeave={() => setTooltip(null)}
                />
                {/* Larger transparent hit area for touch tap targets */}
                <circle
                  cx={x}
                  cy={y}
                  r={Math.max(r, 12)}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (tooltip?.visitor === visitor) {
                      setTooltip(null)
                    } else {
                      showTip(e)
                    }
                  }}
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
                      stroke="rgb(218, 119, 86)"
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
            className="fixed z-50 px-3 py-2 text-xs rounded-lg shadow-lg pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y - 40,
              background: 'var(--bg-2)',
              color: 'var(--fg)',
              border: '1px solid var(--rule-2)',
            }}
          >
            <div className="font-medium">{tooltip.visitor.city}, {tooltip.visitor.country}</div>
            <div style={{ color: 'var(--fg-3)' }}>{tooltip.visitor.count} visits</div>
          </div>
        )}
      </div>

      {/* Stats summary */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm" style={{ color: 'var(--fg-3)' }}>
        <div>
          <span className="text-accent font-semibold">{totalVisits}</span> visits recorded
        </div>
        <div>
          <span className="text-accent font-semibold">{visitors.length}</span> unique locations
        </div>
        <div>
          <span className="text-accent font-semibold">{uniqueCountries}</span> countries
        </div>
      </div>

      {/* Visitor locations list */}
      {visitors.length > 0 && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--rule)' }}>
          <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--fg-2)' }}>Visitor Locations</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[...visitors]
              .sort((a, b) => b.count - a.count)
              .slice(0, 12)
              .map((visitor) => (
                <div
                  key={`${visitor.city}-${visitor.country}`}
                  className="text-xs flex items-center gap-2"
                  style={{ color: 'var(--fg-3)' }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: 'var(--accent-2)' }}
                  />
                  <span className="truncate">
                    {visitor.city}, {visitor.country}
                  </span>
                  <span className="ml-auto" style={{ color: 'var(--fg-3)' }}>{visitor.count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <p className="text-[11px] mt-4" style={{ color: 'var(--fg-3)' }}>
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
            stroke="var(--rule)"
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
            stroke="var(--rule)"
            strokeWidth={0.3}
            strokeDasharray="4,4"
          />
        )
      })}
      {/* Land masses from Natural Earth 110m */}
      <path
        d={worldMapPath}
        fill="var(--bg-3)"
        stroke="var(--rule-2)"
        strokeWidth={0.5}
      />
    </g>
  )
})
