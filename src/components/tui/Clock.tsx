'use client'

import { useEffect, useState } from 'react'

const pad = (n: number) => String(n).padStart(2, '0')

export function Clock() {
  const [t, setT] = useState<Date | null>(null)

  useEffect(() => {
    setT(new Date())
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!t) return <span style={{ minWidth: '8ch', display: 'inline-block' }}>--:--:--</span>

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {pad(t.getHours())}:{pad(t.getMinutes())}:{pad(t.getSeconds())}
    </span>
  )
}
