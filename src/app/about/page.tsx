import { getResume, getSiteContent } from '@/lib/content'

const site = getSiteContent()

export const metadata = {
  title: `About — ${site?.hero.name ?? 'Jim Zhou'}`,
}

export default function AboutPage() {
  const resume = getResume()
  if (!resume) return <p>Resume data not found.</p>

  return (
    <div className="space-y-12 max-w-3xl">
      <section>
        <h1 className="text-3xl font-bold mb-2">{resume.name}</h1>
        <p className="text-accent text-lg mb-4">{resume.title}</p>
        <p className="text-gray-400 leading-relaxed">{resume.summary}</p>
      </section>

      {/* Experience */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Experience</h2>
        <div className="space-y-8">
          {resume.experience.map((exp: any, i: number) => (
            <div key={i} className="relative pl-6 border-l-2 border-gray-800">
              <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-accent" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h3 className="font-semibold text-lg">{exp.role}</h3>
                <span className="text-sm text-gray-500">
                  {exp.start} — {exp.end ?? 'Present'}
                </span>
              </div>
              <p className="text-accent/80 text-sm mb-3">
                {exp.company} · {exp.location}
              </p>
              <ul className="space-y-2">
                {exp.bullets.map((bullet: string, j: number) => (
                  <li key={j} className="text-gray-400 text-sm leading-relaxed flex gap-2">
                    <span className="text-accent mt-1 shrink-0">-</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Skills</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {Object.entries(resume.skills).map(([category, skills]: [string, any]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-accent mb-2">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Education</h2>
        {resume.education.map((edu: any, i: number) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{edu.degree}</p>
              <p className="text-gray-400 text-sm">{edu.school}</p>
            </div>
            <span className="text-gray-500 text-sm">{edu.year}</span>
          </div>
        ))}
      </section>

      {/* Download Resume */}
      <div>
        <a
          href="/resume.pdf"
          className="inline-block px-6 py-2 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors text-sm"
        >
          {site?.pages.about.resumeDownload}
        </a>
        <p className="text-xs text-gray-600 mt-2">{site?.pages.about.resumeNote}</p>
      </div>
    </div>
  )
}
