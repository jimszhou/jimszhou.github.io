import { Box } from '@/components/tui/Box'
import { NotesList } from '@/components/NotesList'
import { getAllContent, getSiteContent } from '@/lib/content'

const site = getSiteContent()

export const metadata = {
  title: `notes — ${site?.hero.name ?? 'Jim Zhou'}`,
}

export default function NotesPage() {
  const notes = getAllContent('checkins')
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags ?? []))).sort()

  return (
    <Box title="notes" hint="latest first" accent>
      <NotesList
        notes={notes.map((n) => ({
          title: n.title,
          slug: n.slug,
          tags: n.tags,
          excerpt: n.description,
        }))}
        allTags={allTags}
      />
    </Box>
  )
}
