import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Jim Zhou — Principal SDE | AI Infrastructure',
  description: 'Personal portfolio of Jim Zhou, Principal Software Development Engineer focused on AI infrastructure and backend systems.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
