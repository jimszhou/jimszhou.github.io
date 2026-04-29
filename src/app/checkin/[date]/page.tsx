import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Box } from '@/components/tui/Box'
import { getAllContent, getContentBySlug } from '@/lib/content'
import { renderMDX } from '@/lib/mdx'

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
    <Box title={data.meta.title} hint={date} accent>
      <Link href="/checkin" className="tui-back">← back to notes</Link>
      {data.meta.tags && (
        <div className="tui-chip-row">
          {data.meta.tags.map((tag) => (
            <span className="tui-chip" key={tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="tui-divider">— — — — — — — — — — — — — — — — — —</div>
      <article className="prose">{content}</article>
    </Box>
  )
}
