import type { ReactNode } from 'react'

interface BoxProps {
  title: string
  hint?: string
  accent?: boolean
  children: ReactNode
}

export function Box({ title, hint, accent, children }: BoxProps) {
  return (
    <div className={'tui-box' + (accent ? ' accent' : '')}>
      <div className="tui-box-title">
        <span className="tui-box-corner">┌─</span>
        <span className="tui-box-name"> {title} </span>
        {hint && <span className="muted tui-box-hint">{hint}</span>}
        <span className="tui-box-fill">
          ────────────────────────────────────────────────────────────────────────────────────
        </span>
        <span className="tui-box-corner">─┐</span>
      </div>
      <div className="tui-box-body">{children}</div>
      <div className="tui-box-bot">
        <span className="tui-box-corner">└─</span>
        <span className="tui-box-fill">
          ────────────────────────────────────────────────────────────────────────────────────
        </span>
        <span className="tui-box-corner">─┘</span>
      </div>
    </div>
  )
}
