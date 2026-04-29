import { Box } from './Box'
import { Nav } from './Nav'
import { LinksBox } from './LinksBox'
import { StatsBox } from './StatsBox'
import { getAllContent, getSiteContent } from '@/lib/content'

export function Sidebar() {
  const site = getSiteContent()
  const notes = getAllContent('checkins')
  const lastCommit = process.env.NEXT_PUBLIC_LAST_COMMIT

  const links = [
    { label: 'github', value: site.social.github.replace('https://', ''), href: site.social.github },
    { label: 'linkedin', value: site.social.linkedin.replace('https://', ''), href: site.social.linkedin },
    { label: 'email', value: site.hero.email, href: `mailto:${site.hero.email}` },
  ]

  return (
    <aside className="tui-pane tui-pane-nav">
      <Box title="nav" hint="[1-5]">
        <Nav items={site.nav} />
      </Box>

      <Box title="links">
        <LinksBox links={links} />
      </Box>

      <Box title="stats" hint="visitors">
        <StatsBox notesCount={notes.length} lastCommit={lastCommit} />
      </Box>
    </aside>
  )
}
