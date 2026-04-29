'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const INITIAL_COUNT = 8

interface Note {
  title: string
  slug: string
  tags?: string[]
  excerpt?: string
}

export function NotesList({ notes, allTags }: { notes: Note[]; allTags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    setShowAll(false)
  }, [activeTag])

  const filtered = activeTag ? notes.filter((n) => n.tags?.includes(activeTag)) : notes
  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_COUNT)

  return (
    <>
      <div className="tui-chip-row" style={{ marginTop: 0, marginBottom: 12 }}>
        <button
          onClick={() => setActiveTag(null)}
          className={'tui-chip button' + (activeTag === null ? ' active' : '')}
        >
          all
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={'tui-chip button' + (activeTag === tag ? ' active' : '')}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="tui-notes">
        {displayed.map((note) => (
          <Link key={note.slug} href={`/checkin/${note.slug}`} className="tui-note">
            <div className="tui-note-row">
              <span className="muted small">{note.slug}</span>
              {note.tags && note.tags.length > 0 && (
                <>
                  <span className="muted small">·</span>
                  <span className="muted small">
                    {note.tags.map((t) => `#${t}`).join(' ')}
                  </span>
                </>
              )}
            </div>
            <div className="tui-bold tui-note-title">{note.title}</div>
            {note.excerpt && <div className="tui-note-excerpt">{note.excerpt}</div>}
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="muted small">No notes found for this tag.</p>
        )}
      </div>

      {!showAll && filtered.length > INITIAL_COUNT && (
        <button
          onClick={() => setShowAll(true)}
          className="tui-chip button"
          style={{ marginTop: 12 }}
        >
          show all {filtered.length} notes
        </button>
      )}
    </>
  )
}
