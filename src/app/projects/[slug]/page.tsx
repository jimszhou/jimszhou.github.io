import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Box } from '@/components/tui/Box'
import { getAllContent, getContentBySlug } from '@/lib/content'
import { renderMDX } from '@/lib/mdx'

export async function generateStaticParams() {
  const projects = getAllContent('projects')
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = getContentBySlug('projects', slug)
  if (!data) return { title: 'Not Found' }
  return { title: `${data.meta.title} — Jim Zhou` }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = getContentBySlug('projects', slug)
  if (!data) notFound()

  const content = await renderMDX(data.content)

  return (
    <Box title={data.meta.title} hint="project" accent>
      <Link href="/projects" className="tui-back">← back to projects</Link>
      <div className="tui-meta">
        {data.meta.date && <span>{data.meta.date}</span>}
        {data.meta.github && (
          <>
            <span>·</span>
            <a href={data.meta.github} target="_blank" rel="noopener noreferrer">
              github
            </a>
          </>
        )}
        {data.meta.demo && (
          <>
            <span>·</span>
            <a href={data.meta.demo} target="_blank" rel="noopener noreferrer">
              demo
            </a>
          </>
        )}
      </div>
      {data.meta.tags && (
        <div className="tui-chip-row">
          {data.meta.tags.map((tag) => (
            <span className="tui-chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="tui-divider">— — — — — — — — — — — — — — — — — —</div>
      <article className="prose">{content}</article>
    </Box>
  )
}
