import { Box } from '@/components/tui/Box'
import { getResume, getSiteContent } from '@/lib/content'

const site = getSiteContent()

export const metadata = {
  title: `about — ${site?.hero.name ?? 'Jim Zhou'}`,
}

interface ExperienceItem {
  company: string
  role: string
  start: string
  end: string | null
  location: string
  bullets: string[]
}

export default function AboutPage() {
  const resume = getResume()
  if (!resume) return <p>Resume data not found.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Box title="experience" accent>
        <div className="tui-timeline" id="experience">
          {resume.experience.map((exp: ExperienceItem, i: number) => (
            <div className="tui-tl-row" key={i}>
              <div className="tui-tl-period muted">
                {exp.start} — {exp.end ?? 'now'}
              </div>
              <div className="tui-tl-rail">
                <div className="tui-tl-dot" />
                {i < resume.experience.length - 1 && <div className="tui-tl-line" />}
              </div>
              <div className="tui-tl-body">
                <div className="tui-bold">{exp.role}</div>
                <div className="muted">
                  @ {exp.company} · {exp.location}
                </div>
                <ul className="tui-tl-bullets">
                  {exp.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          {resume.education.map(
            (edu: { school: string; degree: string; year: string }, i: number) => (
              <div className="tui-tl-row" key={`edu-${i}`}>
                <div className="tui-tl-period muted">{edu.year}</div>
                <div className="tui-tl-rail">
                  <div className="tui-tl-dot" />
                </div>
                <div className="tui-tl-body">
                  <div className="tui-bold">{edu.degree}</div>
                  <div className="muted">@ {edu.school}</div>
                </div>
              </div>
            ),
          )}
        </div>
      </Box>

      <Box title="skills" accent>
        <div className="tui-skills" id="skills">
          {Object.entries(resume.skills).map(([group, items]) => (
            <div className="tui-skill-group" key={group}>
              <div className="tui-skill-head muted">[{group.toUpperCase()}]</div>
              <div className="tui-chip-row">
                {(items as string[]).map((s) => (
                  <span className="tui-chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Box>
    </div>
  )
}
