import { Box } from '@/components/tui/Box'
import { getSiteContent } from '@/lib/content'

const site = getSiteContent()

export const metadata = {
  title: `contact — ${site?.hero.name ?? 'Jim Zhou'}`,
}

const padKey = (s: string) => s.padEnd(8, ' ')

export default function ContactPage() {
  const hero = site.hero
  const social = site.social

  const rows = [
    { key: 'email', value: hero.email, href: `mailto:${hero.email}` },
    { key: 'github', value: social.github.replace('https://', ''), href: social.github },
    { key: 'linkedin', value: social.linkedin.replace('https://', ''), href: social.linkedin },
    { key: 'tz', value: hero.tz },
  ]

  return (
    <Box title="contact" accent>
      <div className="tui-contact">
        {rows.map((r) => (
          <div className="tui-contact-row" key={r.key}>
            <span className="tui-contact-key muted">{padKey(r.key)}</span>
            {r.href ? (
              <a
                href={r.href}
                target={r.href.startsWith('http') ? '_blank' : undefined}
                rel={r.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{ color: 'var(--accent)' }}
              >
                {r.value}
              </a>
            ) : (
              <span>{r.value}</span>
            )}
          </div>
        ))}
        <div className="tui-divider">— — — — — — — — — — — — — — — — — —</div>
        <div className="muted">{site.pages.contact.note}</div>
      </div>
    </Box>
  )
}
