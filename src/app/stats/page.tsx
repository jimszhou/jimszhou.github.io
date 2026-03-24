import { getSiteContent } from '@/lib/content'
import { VisitorMap } from '@/components/VisitorMap'

const site = getSiteContent()

export const metadata = {
  title: `${site?.pages.stats.title ?? 'Visitor Stats'} — ${site?.hero.name ?? 'Jim Zhou'}`,
}

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
    </div>
  )
}
