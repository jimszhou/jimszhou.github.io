import Link from 'next/link'
import { getAllContent, getSiteContent } from '@/lib/content'
import { StatsWidget } from '@/components/StatsWidget'

export default function Home() {
  const site = getSiteContent()
  const allNotes = getAllContent('checkins')
  const recentNotes = allNotes.slice(0, 3)

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="pt-8 sm:pt-16">
        <h1 className="text-4xl sm:text-6xl mb-4 tracking-wide">
          {site.hero.name}
        </h1>
        <p className="font-stencil text-xl sm:text-2xl text-accent mb-6">
          {site.hero.title}
        </p>
        <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
          {site.hero.bio}
        </p>
        <div className="flex gap-4 mt-6">
          <a
            href={site.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-stencil px-4 py-2 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-accent hover:text-accent transition-colors"
          >
            GitHub
          </a>
          <a
            href={site.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-stencil px-4 py-2 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-accent hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="/resume.pdf"
            className="font-stencil px-4 py-2 border border-accent text-accent rounded-lg text-sm hover:bg-accent/10 transition-colors"
          >
            {site.hero.resumeLabel}
          </a>
        </div>
      </section>

      {/* Highlights */}
      <section>
        <h2 className="text-3xl mb-6">Explore</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/projects"
            className="group p-6 border border-gray-800 rounded-xl hover:border-accent/40 transition-colors"
          >
            <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
              {site.explore.projects.title}
            </h3>
            <p className="text-gray-400 text-sm">
              {site.explore.projects.description}
            </p>
          </Link>
          <Link
            href="/checkin"
            className="group p-6 border border-gray-800 rounded-xl hover:border-accent/40 transition-colors"
          >
            <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
              {site.explore.notes.title}
            </h3>
            <p className="text-gray-400 text-sm">
              {site.explore.notes.descriptionTemplate.replace('{count}', String(allNotes.length))}
            </p>
          </Link>
        </div>
      </section>

      {/* Visitor Reach */}
      <section>
        <StatsWidget />
      </section>

      {/* Recent Notes */}
      {recentNotes.length > 0 && (
        <section>
          <h2 className="text-3xl mb-6">Recent Notes</h2>
          <div className="space-y-4">
            {recentNotes.map((note) => (
              <Link
                key={note.slug}
                href={`/checkin/${note.slug}`}
                className="block p-4 border border-gray-800 rounded-lg hover:border-accent/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg">{note.title}</h3>
                  <span className="text-sm text-gray-500">{note.slug}</span>
                </div>
                {note.tags && (
                  <div className="flex gap-2 flex-wrap">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-stencil text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
