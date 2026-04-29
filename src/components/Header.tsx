import { Clock } from './tui/Clock'
import { ThemeToggle } from './tui/ThemeToggle'
import { getSiteContent } from '@/lib/content'

function CatLogo() {
  return (
    <span
      className="cat-logo inline-block leading-[1.05] select-none"
      aria-label="Cool cat logo"
      style={{ fontSize: '9px' }}
    >
      <span style={{ display: 'block' }}> /\_/\</span>
      <span style={{ display: 'block' }}>
        ({' '}
        <span className="cat-shades">■_■</span>
        {' )'}
      </span>
      <span style={{ display: 'block' }}> {'> ^ <'}</span>
    </span>
  )
}

export function Header() {
  const site = getSiteContent()
  return (
    <div className="tui-header">
      <div className="tui-h-left">
        <CatLogo />
        <span className="tui-bold">{site.hero.handle ?? 'jim'}@dev</span>
        <span className="muted">:</span>
        <span>~/sites/jim-zhou</span>
      </div>
      <div className="tui-h-center">
        <span>{site.header?.centerText ?? `session · ${site.hero.location}`}</span>
      </div>
      <div className="tui-h-right">
        <Clock />
        <ThemeToggle />
      </div>
    </div>
  )
}
