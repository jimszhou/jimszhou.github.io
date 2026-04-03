import { getAllContent, getContentBySlug } from '@/lib/content'
import { renderMDX } from '@/lib/mdx'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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
    <div className="max-w-3xl">
      <Link href="/projects" className="text-sm text-gray-500 hover:text-accent transition-colors mb-6 inline-block">
        &larr; Back to Projects
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-3">{data.meta.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {data.meta.date && <span>{data.meta.date}</span>}
          {data.meta.github && (
            <a
              href={data.meta.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              GitHub
            </a>
          )}
          {data.meta.demo && (
            <a
              href={data.meta.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Live Demo
            </a>
          )}
        </div>
        {data.meta.tags && (
          <div className="flex gap-2 flex-wrap mt-3">
            {data.meta.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <article className="prose">{content}</article>
    </div>
  )
}
