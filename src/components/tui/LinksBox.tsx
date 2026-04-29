interface LinkRow {
  label: string
  value: string
  href: string
}

const padLabel = (s: string) => s.padEnd(8, ' ')

export function LinksBox({ links }: { links: LinkRow[] }) {
  return (
    <>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target={l.href.startsWith('http') ? '_blank' : undefined}
          rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="tui-link-row"
        >
          <span className="tui-link-label">{padLabel(l.label)}</span>
          <span>{l.value}</span>
        </a>
      ))}
    </>
  )
}
