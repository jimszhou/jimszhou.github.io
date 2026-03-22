import Link from 'next/link'
import { getAllContent, getCheckinDates } from '@/lib/content'

export default function Home() {
  const recentCheckins = getAllContent('checkins').slice(0, 3)
  const checkinCount = getCheckinDates().length

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="pt-8 sm:pt-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Jim Zhou
        </h1>
        <p className="text-xl text-teal-400 mb-6">
          Principal SDE | AI Infrastructure
        </p>
        <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
          Principal Software Development Engineer at Fortinet, building high-performance
          backend systems and cloud-native security infrastructure. Currently diving deep
          into AI infrastructure — LLM serving, GPU optimization, and distributed ML systems.
        </p>
        <div className="flex gap-4 mt-6">
          <a
            href="https://github.com/jimszhou"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-teal-500 hover:text-teal-400 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/jimszhou"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-teal-500 hover:text-teal-400 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </section>

      {/* Highlights */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Explore</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            href="/projects"
            className="group p-6 border border-gray-800 rounded-xl hover:border-teal-500/50 transition-colors"
          >
            <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-400 transition-colors">
              Projects
            </h3>
            <p className="text-gray-400 text-sm">
              Hands-on engineering projects — from LLM infrastructure to distributed systems.
            </p>
          </Link>
          <Link
            href="/checkin"
            className="group p-6 border border-gray-800 rounded-xl hover:border-teal-500/50 transition-colors"
          >
            <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-400 transition-colors">
              Check-in
            </h3>
            <p className="text-gray-400 text-sm">
              Daily learning log — {checkinCount} check-ins and counting.
            </p>
          </Link>
          <Link
            href="/ai-lab"
            className="group p-6 border border-gray-800 rounded-xl hover:border-teal-500/50 transition-colors"
          >
            <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-400 transition-colors">
              AI Lab
            </h3>
            <p className="text-gray-400 text-sm">
              AI experiments, deep-dives, and explorations in machine learning.
            </p>
          </Link>
        </div>
      </section>

      {/* Recent Check-ins */}
      {recentCheckins.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6">Recent Check-ins</h2>
          <div className="space-y-4">
            {recentCheckins.map((checkin) => (
              <Link
                key={checkin.slug}
                href={`/checkin/${checkin.slug}`}
                className="block p-4 border border-gray-800 rounded-lg hover:border-teal-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{checkin.title}</h3>
                  <span className="text-sm text-gray-500">{checkin.slug}</span>
                </div>
                {checkin.tags && (
                  <div className="flex gap-2 flex-wrap">
                    {checkin.tags.map((tag) => (
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
          </div>
        </section>
      )}
    </div>
  )
}
