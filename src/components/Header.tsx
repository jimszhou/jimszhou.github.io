'use client'

import Link from 'next/link'
import { useState } from 'react'
import siteContent from '../../content/site.json'

const navItems = siteContent.nav

function CatLogo() {
  return (
    <span className="cat-logo inline-block font-mono text-[10px] leading-[1.1] select-none" aria-label="Cool cat logo">
      <span className="block">
        <span className="text-[#6B9BD2]">{' /\\_/\\'}</span>
      </span>
      <span className="block">
        <span className="text-[#6B9BD2]">{'('}</span>
        <span className="cat-shades text-[#E8B84B]">{' \u25A0_\u25A0'}</span>
        <span className="text-[#6B9BD2]">{' )'}</span>
      </span>
      <span className="block">
        <span className="text-[#6B9BD2]">{' > ^ <'}</span>
      </span>
    </span>
  )
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b border-gray-800 bg-[#0F0E0D]/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-3">
          <CatLogo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-400 hover:text-accent transition-colors text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-400 hover:text-accent"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gray-800 bg-[#0F0E0D]/95 px-4 py-4 flex flex-col gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-400 hover:text-accent transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
