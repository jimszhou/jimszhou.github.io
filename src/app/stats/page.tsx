import { Box } from '@/components/tui/Box'
import { VisitorMap } from '@/components/VisitorMap'
import { getSiteContent } from '@/lib/content'

const site = getSiteContent()

export const metadata = {
  title: `${site?.pages.stats.title ?? 'stats'} — ${site?.hero.name ?? 'Jim Zhou'}`,
}

export default function StatsPage() {
  return (
    <Box title="stats" hint="visitor map" accent>
      <p className="muted small" style={{ marginBottom: 12 }}>
        {site?.pages.stats.subtitle}
      </p>
      <VisitorMap />
    </Box>
  )
}
