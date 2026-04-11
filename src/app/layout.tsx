import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getSiteContent } from '@/lib/content'
import VisitorTracker from '@/components/VisitorTracker'

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Datatype&family=Fjalla+One&family=Saira+Stencil+One&display=swap"
          rel="stylesheet"
        />
      </head>
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
