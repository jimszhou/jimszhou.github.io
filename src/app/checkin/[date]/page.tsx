import { getAllContent, getContentBySlug } from '@/lib/content'
import { renderMDX } from '@/lib/mdx'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const items = getAllContent('checkins')
  return items.map((item) => ({ date: item.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params
  const data = getContentBySlug('checkins', date)
  if (!data) return { title: 'Not Found' }
  return { title: `${data.meta.title} — Jim Zhou` }
}

export default async function CheckinDetailPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params
  const data = getContentBySlug('checkins', date)
  if (!data) notFound()

  const content = await renderMDX(data.content)

  return (
    <div className="max-w-3xl">
      <Link href="/checkin" className="text-sm text-gray-500 hover:text-teal-400 transition-colors mb-6 inline-block">
        &larr; Back to Notes
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{data.meta.title}</h1>
        <span className="text-sm text-gray-500">{date}</span>
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
