'use client'

import { useEffect, useState } from 'react'

interface IntroLine {
  type: 'cmd' | 'out'
  text: string
}

export function TypedIntro({ lines }: { lines: IntroLine[] }) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (shown >= lines.length) return
    const id = setTimeout(() => setShown((s) => s + 1), shown < 2 ? 320 : 180)
    return () => clearTimeout(id)
  }, [shown, lines.length])

  return (
    <div className="tui-typed">
      {lines.slice(0, shown).map((l, i) => (
        <div key={i} className={'tui-typed-line ' + l.type}>
          {l.type === 'cmd' ? (
            <>
              <span className="tui-prompt">jim@dev ~ $ </span>
              {l.text}
            </>
          ) : (
            <span>{l.text}</span>
          )}
        </div>
      ))}
      {shown < lines.length && (
        <div className="tui-typed-line cmd">
          <span className="tui-prompt">jim@dev ~ $ </span>
          <span className="caret-blink">▍</span>
        </div>
      )}
    </div>
  )
}
