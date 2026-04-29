'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface NavItem {
  key: string
  href: string
  label: string
  match?: string
}

function isActive(item: NavItem, pathname: string) {
  const target = (item.match ?? item.href).split('#')[0]
  if (target === '/') return pathname === '/'
  return pathname === target || pathname.startsWith(target + '/')
}

export function Nav({ items }: { items: NavItem[] }) {
  const pathname = usePathname() || '/'

  return (
    <>
      {items.map((item) => {
        const active = isActive(item, pathname)
        return (
          <Link
            key={item.key}
            href={item.href}
            className={'tui-nav-row' + (active ? ' active' : '')}
          >
            <span className="tui-nav-key">[{item.key}]</span>
            <span className="tui-nav-label">{item.label}</span>
            <span className="tui-nav-arrow">{active ? '▶' : ' '}</span>
          </Link>
        )
      })}
    </>
  )
}
