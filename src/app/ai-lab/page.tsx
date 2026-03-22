import Link from 'next/link'
import { getAllContent } from '@/lib/content'

export const metadata = {
  title: 'AI Lab — Jim Zhou',
}

export default function AILabPage() {
  const experiments = getAllContent('ai-lab')

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">AI Lab</h1>
      <p className="text-gray-400 mb-8">AI learning, experiments, and deep-dives.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {experiments.map((exp) => (
          <Link
            key={exp.slug}
            href={`/ai-lab/${exp.slug}`}
            className="group p-6 border border-gray-800 rounded-xl hover:border-teal-500/50 transition-colors"
          >
            <h2 className="font-semibold text-lg mb-2 group-hover:text-teal-400 transition-colors">
              {exp.title}
            </h2>
            {exp.description && (
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{exp.description}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {exp.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {exp.model && <span>{exp.model}</span>}
                {exp.date && <span>{exp.date}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
