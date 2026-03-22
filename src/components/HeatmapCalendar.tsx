'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

interface HeatmapCalendarProps {
  checkedInDates: string[]
}

const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun']
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function HeatmapCalendar({ checkedInDates }: HeatmapCalendarProps) {
  const router = useRouter()
  const [tooltip, setTooltip] = useState<{ date: string; x: number; y: number } | null>(null)

  const dateSet = useMemo(() => new Set(checkedInDates), [checkedInDates])

  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Go back 364 days (365 total including today)
    const start = new Date(today)
    start.setDate(start.getDate() - 364)

    // Adjust start to Monday
    const startDay = start.getDay()
    const mondayOffset = startDay === 0 ? -6 : 1 - startDay
    start.setDate(start.getDate() + mondayOffset)

    const weeks: { date: Date; dateStr: string }[][] = []
    const monthLabels: { label: string; weekIndex: number }[] = []
    let currentWeek: { date: Date; dateStr: string }[] = []
    let lastMonth = -1

    const cursor = new Date(start)
    let weekIndex = 0

    while (cursor <= today || currentWeek.length > 0) {
      if (cursor > today && currentWeek.length === 0) break

      const dateStr = formatDate(cursor)
      const month = cursor.getMonth()

      if (month !== lastMonth) {
        monthLabels.push({ label: MONTH_LABELS[month], weekIndex })
        lastMonth = month
      }

      currentWeek.push({ date: new Date(cursor), dateStr })

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
        weekIndex++
      }

      cursor.setDate(cursor.getDate() + 1)
      if (cursor > today && currentWeek.length > 0) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }

    return { weeks, monthLabels }
  }, [])

  const handleClick = (dateStr: string) => {
    if (dateSet.has(dateStr)) {
      router.push(`/checkin/${dateStr}`)
    }
  }

  return (
    <div className="relative overflow-x-auto">
      <div className="inline-flex gap-0.5">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-2 text-xs text-gray-500">
          {DAY_LABELS.map((label, i) => (
            <div key={i} className="h-3 w-6 flex items-center text-[10px]">
              {label}
            </div>
          ))}
        </div>

        {/* Weeks grid */}
        <div>
          {/* Month labels */}
          <div className="flex gap-0.5 mb-1 text-xs text-gray-500 h-4">
            {monthLabels.map((m, i) => {
              const nextPos = monthLabels[i + 1]?.weekIndex ?? weeks.length
              const span = nextPos - m.weekIndex
              return (
                <div
                  key={`${m.label}-${i}`}
                  className="text-[10px]"
                  style={{ width: `${span * 14}px` }}
                >
                  {span >= 3 ? m.label : ''}
                </div>
              )
            })}
          </div>

          <div className="flex gap-0.5">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((day) => {
                  const hasCheckin = dateSet.has(day.dateStr)
                  return (
                    <div
                      key={day.dateStr}
                      className={`w-3 h-3 rounded-sm border cursor-pointer transition-colors ${
                        hasCheckin
                          ? 'bg-teal-500 border-teal-600 hover:bg-teal-400'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => handleClick(day.dateStr)}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        setTooltip({ date: day.dateStr, x: rect.left, y: rect.top })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 bg-gray-800 text-gray-200 text-xs rounded shadow-lg pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y - 28 }}
        >
          {tooltip.date}
          {dateSet.has(tooltip.date) && ' (checked in)'}
        </div>
      )}
    </div>
  )
}
