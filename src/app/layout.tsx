import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getSiteContent } from '@/lib/content'
import VisitorTracker from '@/components/VisitorTracker'

const VisitorTracker = dynamic(() => import('@/components/VisitorTracker'), { ssr: false })

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
    <html lang="en" className="dark">
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
