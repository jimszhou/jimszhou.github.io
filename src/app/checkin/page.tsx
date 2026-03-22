import Link from 'next/link'
import { getAllContent, getCheckinDates } from '@/lib/content'
import { HeatmapCalendar } from '@/components/HeatmapCalendar'

export const metadata = {
  title: 'Check-in — Jim Zhou',
}

export default function CheckinPage() {
  const checkinDates = getCheckinDates()
  const checkins = getAllContent('checkins')

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Check-in</h1>
        <p className="text-gray-400 mb-8">
          Daily learning log — {checkinDates.length} check-ins so far.
        </p>
        <HeatmapCalendar checkedInDates={checkinDates} />
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
        <div className="space-y-4">
          {checkins.map((checkin) => (
            <Link
              key={checkin.slug}
              href={`/checkin/${checkin.slug}`}
              className="block p-4 border border-gray-800 rounded-lg hover:border-teal-500/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{checkin.title}</h3>
                <span className="text-sm text-gray-500">{checkin.slug}</span>
              </div>
              {checkin.tags && (
                <div className="flex gap-2 flex-wrap">
                  {checkin.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
