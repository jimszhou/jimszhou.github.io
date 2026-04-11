import Link from 'next/link'
import { getAllContent, getSiteContent } from '@/lib/content'

const site = getSiteContent()

export const metadata = {
  title: `${site?.pages.projects.title ?? 'Projects'} — ${site?.hero.name ?? 'Jim Zhou'}`,
}

export default function ProjectsPage() {
  const projects = getAllContent('projects')

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl mb-2">{site?.pages.projects.title}</h1>
      <p className="text-gray-400 mb-8">{site?.pages.projects.subtitle}</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group p-6 border border-gray-800 rounded-xl hover:border-accent/40 transition-colors"
          >
            <h2 className="text-xl mb-2 group-hover:text-accent transition-colors">
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
                    className="font-stencil text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded"
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
