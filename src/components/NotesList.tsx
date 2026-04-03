'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Note {
  title: string
  slug: string
  tags?: string[]
}

export function NotesList({ notes, allTags }: { notes: Note[]; allTags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = activeTag
    ? notes.filter((n) => n.tags?.includes(activeTag))
    : notes

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => setActiveTag(null)}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            activeTag === null
              ? 'bg-teal-500/20 border-teal-500 text-teal-400'
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
                ? 'bg-teal-500/20 border-teal-500 text-teal-400'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((note) => (
          <Link
            key={note.slug}
            href={`/checkin/${note.slug}`}
            className="block p-4 border border-gray-800 rounded-lg hover:border-teal-500/50 transition-colors"
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
    </>
  )
}
