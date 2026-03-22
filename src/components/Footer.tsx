export function Footer() {
  return (
    <footer className="border-t border-gray-800 py-8 mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Jim Zhou. All rights reserved.</p>
        <div className="flex gap-4">
          <a
            href="https://github.com/jimszhou"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-400 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/jimszhou"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-400 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
