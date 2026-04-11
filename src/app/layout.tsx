import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getSiteContent } from '@/lib/content'
import VisitorTracker from '@/components/VisitorTracker'

const pressStart2P = localFont({
  src: '../fonts/PressStart2P-Regular.ttf',
  variable: '--font-pixel-heading',
  display: 'swap',
})

const vt323 = localFont({
  src: '../fonts/VT323-Regular.ttf',
  variable: '--font-pixel-body',
  display: 'swap',
})

const site = getSiteContent()

export const metadata: Metadata = {
  title: site?.meta.siteTitle ?? 'Jim Zhou',
  description: site?.meta.siteDescription ?? '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${pressStart2P.variable} ${vt323.variable}`}>
      <body className="min-h-screen flex flex-col">
        <VisitorTracker />
        <Header />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
