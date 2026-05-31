'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavItem } from './Nav'

function isActive(item: NavItem, pathname: string) {
  const target = (item.match ?? item.href).split('#')[0]
  if (target === '/') return pathname === '/'
  return pathname === target || pathname.startsWith(target + '/')
}

/**
 * Horizontal, sticky nav shown only on small screens (see .tui-topnav in
 * globals.css). On desktop the regular vertical Nav inside the sidebar is used.
 */
export function MobileNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname() || '/'

  return (
    <nav className="tui-topnav" aria-label="primary">
      {items.map((item) => {
        const active = isActive(item, pathname)
        return (
          <Link
            key={item.key}
            href={item.href}
            className={'tui-topnav-item' + (active ? ' active' : '')}
          >
            <span className="tui-nav-key">[{item.key}]</span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
