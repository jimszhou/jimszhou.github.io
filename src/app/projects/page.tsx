import Link from 'next/link'
import { getAllContent } from '@/lib/content'

export const metadata = {
  title: 'Projects — Jim Zhou',
}

export default function ProjectsPage() {
  const projects = getAllContent('projects')

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Projects</h1>
      <p className="text-gray-400 mb-8">Hands-on engineering projects and explorations.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group p-6 border border-gray-800 rounded-xl hover:border-teal-500/50 transition-colors"
          >
            <h2 className="font-semibold text-lg mb-2 group-hover:text-teal-400 transition-colors">
              {project.title}
            </h2>
            {project.description && (
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {project.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {project.date && (
                <span className="text-xs text-gray-500">{project.date}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
