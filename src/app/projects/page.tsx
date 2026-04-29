import Link from 'next/link'
import { Box } from '@/components/tui/Box'
import { getAllContent, getSiteContent } from '@/lib/content'

const site = getSiteContent()

export const metadata = {
  title: `projects — ${site?.hero.name ?? 'Jim Zhou'}`,
}

export default function ProjectsPage() {
  const projects = getAllContent('projects')

  return (
    <Box title="projects" hint="click a row to open" accent>
      <div className="tui-table">
        <div className="tui-tr head">
          <div>name</div>
          <div>description</div>
          <div>tags</div>
          <div className="r">★</div>
          <div>year</div>
        </div>
        {projects.map((p) => {
          const year = p.date ? p.date.slice(0, 4) : '—'
          return (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="tui-tr link">
              <div className="tui-bold">{p.title}</div>
              <div>{p.description}</div>
              <div className="muted">{p.tags?.slice(0, 3).join(' · ')}</div>
              <div className="r muted">—</div>
              <div>{year}</div>
            </Link>
          )
        })}
      </div>

      {projects.length > 0 && (
        <>
          <div className="tui-divider">— — — — — — — — — — — — — — — — — —</div>
          <div className="tui-cards">
            {projects.slice(0, 2).map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="tui-card" style={{ display: 'block' }}>
                <div className="tui-card-head">
                  <span className="tui-bold">{p.title}</span>
                  <span className="muted small">{p.date?.slice(0, 7)}</span>
                </div>
                <div className="muted small">{p.tags?.slice(0, 4).join(' · ')}</div>
                <div className="tui-card-body">{p.description}</div>
              </Link>
            ))}
          </div>
        </>
      )}
    </Box>
  )
}
