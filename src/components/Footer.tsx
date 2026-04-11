import { getSiteContent } from '@/lib/content'

export function Footer() {
  const site = getSiteContent()

  return (
    <footer className="border-t border-gray-800 py-8 mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} {site?.footer.copyright}</p>
        <div className="flex gap-4">
          <a
            href={site?.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            GitHub
          </a>
          <a
            href={site?.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
