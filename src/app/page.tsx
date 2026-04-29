import { Box } from '@/components/tui/Box'
import { TypedIntro } from '@/components/tui/TypedIntro'
import { getSiteContent } from '@/lib/content'

export default function Home() {
  const site = getSiteContent()
  const hero = site.hero

  return (
    <Box title={`about ${hero.handle ?? 'jim'}`} hint="press [2] for projects" accent>
      <div className="tui-name">{hero.name}</div>
      <div className="muted">
        {hero.role} · {hero.focus} · {hero.location}
      </div>
      {hero.bio.map((p: string, i: number) => (
        <div className="tui-bio" key={i}>
          {p}
        </div>
      ))}
      <div className="tui-divider">— — — — — — — — — — — — — — — — — —</div>
      <TypedIntro lines={site.intro_lines} />
    </Box>
  )
}
