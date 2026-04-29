import { getSiteContent } from '@/lib/content'

export function Footer() {
  const site = getSiteContent()
  const version = site?.header?.version ?? 'v0.5.0 · jim-zhou'

  return (
    <div className="tui-footer">
      <span><kbd>1-5</kbd> nav</span>
      <span><kbd>j</kbd>/<kbd>k</kbd> scroll</span>
      <span><kbd>g</kbd> github</span>
      <span><kbd>?</kbd> help</span>
      <span><kbd>q</kbd> quit</span>
      <span className="tui-foot-fill" />
      <span className="muted">{version}</span>
    </div>
  )
}
