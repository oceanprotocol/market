import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'
import fs from 'fs'
import { join } from 'path'

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(remarkGfm).use(remarkHtml).process(markdown)

  return result.toString()
}

const pagesDirectory = join(process.cwd(), 'content', 'pages')

export interface PageData {
  slug: string
  frontmatter: { [key: string]: any }
  content: string
}

export function getPageBySlug(slug: string): PageData {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(pagesDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return { slug: realSlug, frontmatter: { ...data }, content }
}

export function getAllPages(): PageData[] {
  const slugs = fs.readdirSync(pagesDirectory)
  const pages = slugs.map((slug) => getPageBySlug(slug))

  return pages
}
