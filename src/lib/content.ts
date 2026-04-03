import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')

export interface ContentMeta {
  title: string
  description?: string
  date?: string
  tags?: string[]
  slug: string
  github?: string
  demo?: string
  model?: string
}

export function getContentBySlug(dir: string, slug: string) {
  const fullPath = path.join(contentDir, dir, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) {
    // Try .md extension
    const mdPath = path.join(contentDir, dir, `${slug}.md`)
    if (!fs.existsSync(mdPath)) return null
    const fileContents = fs.readFileSync(mdPath, 'utf8')
    const { data, content } = matter(fileContents)
    return { meta: { ...data, slug } as ContentMeta, content }
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  return { meta: { ...data, slug } as ContentMeta, content }
}

export function getAllContent(dir: string): ContentMeta[] {
  const fullDir = path.join(contentDir, dir)
  if (!fs.existsSync(fullDir)) return []

  const files = fs.readdirSync(fullDir).filter(
    (f) => f.endsWith('.mdx') || f.endsWith('.md')
  )

  const items = files.map((filename) => {
    const slug = filename.replace(/\.(mdx|md)$/, '')
    const fileContents = fs.readFileSync(path.join(fullDir, filename), 'utf8')
    const { data } = matter(fileContents)
    return { ...data, slug } as ContentMeta
  })

  // Sort by date descending (newest first)
  // Fall back to slug as date for files like checkins where slug is the date
  const getDate = (item: ContentMeta): number => {
    if (item.date) return new Date(item.date).getTime()
    if (/^\d{4}-\d{2}-\d{2}$/.test(item.slug)) return new Date(item.slug).getTime()
    return 0
  }
  return items.sort((a, b) => getDate(b) - getDate(a))
}


export function getResume() {
  const filePath = path.join(contentDir, 'resume.json')
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw)
}

export function getSiteContent() {
  const filePath = path.join(contentDir, 'site.json')
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw)
}
