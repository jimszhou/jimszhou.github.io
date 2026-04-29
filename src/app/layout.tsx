import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Sidebar } from '@/components/tui/Sidebar'
import { KeyboardNav } from '@/components/tui/KeyboardNav'
import { getSiteContent } from '@/lib/content'
import VisitorTracker from '@/components/VisitorTracker'

const site = getSiteContent()

export const metadata: Metadata = {
  title: site?.meta.siteTitle ?? 'Jim Zhou',
  description: site?.meta.siteDescription ?? '',
}

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t='dark'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}})();`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <VisitorTracker />
        <KeyboardNav items={site.nav} githubUrl={site.social.github} />
        <div className="tui">
          <Header />
          <div className="tui-grid">
            <Sidebar />
            <main className="tui-pane tui-pane-main">{children}</main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
