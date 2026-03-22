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

  // Sort by date descending
  return items.sort((a, b) => {
    if (!a.date || !b.date) return 0
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getCheckinDates(): string[] {
  const dir = path.join(contentDir, 'checkins')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => f.replace(/\.(mdx|md)$/, ''))
    .sort()
}

export function getResume() {
  const filePath = path.join(contentDir, 'resume.json')
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw)
}
