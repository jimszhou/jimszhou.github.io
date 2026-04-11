'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const INITIAL_COUNT = 6

interface Note {
  title: string
  slug: string
  tags?: string[]
}

export function NotesList({ notes, allTags }: { notes: Note[]; allTags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    setShowAll(false)
  }, [activeTag])

  const filtered = activeTag
    ? notes.filter((n) => n.tags?.includes(activeTag))
    : notes

  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_COUNT)

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => setActiveTag(null)}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            activeTag === null
              ? 'bg-accent/20 border-accent text-accent'
              : 'border-gray-700 text-gray-400 hover:border-gray-500'
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              activeTag === tag
                ? 'bg-accent/20 border-accent text-accent'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {displayed.map((note) => (
          <Link
            key={note.slug}
            href={`/checkin/${note.slug}`}
            className="block p-4 border border-gray-800 rounded-lg hover:border-accent/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{note.title}</h3>
              <span className="text-sm text-gray-500">{note.slug}</span>
            </div>
            {note.tags && (
              <div className="flex gap-2 flex-wrap">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm">No notes found for this tag.</p>
        )}
      </div>

      {!showAll && filtered.length > INITIAL_COUNT && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 text-sm text-accent hover:underline"
        >
          Show all {filtered.length} notes
        </button>
      )}
    </>
  )
}
