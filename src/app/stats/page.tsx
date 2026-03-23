import { getSiteContent } from '@/lib/content'
import { VisitorMap } from '@/components/VisitorMap'

const site = getSiteContent()

export const metadata = {
  title: `${site?.pages.stats.title ?? 'Visitor Stats'} — ${site?.hero.name ?? 'Jim Zhou'}`,
}

// GoatCounter site code — update this to match your goatcounter.com registration
const GOATCOUNTER_SITE = 'jimszhou'

export default function StatsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{site?.pages.stats.title}</h1>
      <p className="text-gray-400 mb-8">{site?.pages.stats.subtitle}</p>

      {/* World Map */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Visitor Map</h2>
        <VisitorMap />
      </section>

      {/* GoatCounter Dashboard Embed */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Detailed Analytics</h2>
        <div className="border border-gray-800 rounded-xl overflow-hidden">
          <iframe
            src={`https://${GOATCOUNTER_SITE}.goatcounter.com`}
            className="w-full border-0 bg-white rounded-xl"
            style={{ height: '800px' }}
            title="Visitor Analytics"
            loading="lazy"
          />
        </div>
        <p className="text-gray-500 text-sm mt-3">
          Powered by{' '}
          <a
            href="https://www.goatcounter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-500 hover:text-teal-400"
          >
            GoatCounter
          </a>
          {' '}— privacy-friendly, open-source analytics.
        </p>
      </section>
    </div>
  )
}
