import { getAllContent, getSiteContent } from '@/lib/content'
import { NotesList } from '@/components/NotesList'

const site = getSiteContent()

export const metadata = {
  title: `${site?.pages.notes.title ?? 'Notes'} — ${site?.hero.name ?? 'Jim Zhou'}`,
}

export default function NotesPage() {
  const notes = getAllContent('checkins')

  const allTags = Array.from(
    new Set(notes.flatMap((n) => n.tags ?? []))
  ).sort()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold mb-2">{site?.pages.notes.title}</h1>
        <p className="text-gray-400 mb-6">
          {site?.pages.notes.subtitle}
        </p>
      </div>

      <NotesList
        notes={notes.map((n) => ({ title: n.title, slug: n.slug, tags: n.tags }))}
        allTags={allTags}
      />
    </div>
  )
}
