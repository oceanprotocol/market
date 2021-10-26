import matter from 'gray-matter'
import remark from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'
import fs from 'fs'
import { join } from 'path'

export function markdownToHtml(markdown: string): string {
  const result = remark()
    .use(remarkGfm)
    .use(remarkHtml) // serializes through remark-rehype and rehype-stringify
    .processSync(markdown).contents

  return result.toString()
}

//
// Next.js specifics to be used in getStaticProps / getStaticPaths
// to automatically generate pages from Markdown files in `src/pages/[slug].tsx`
//
const pagesDirectory = join(process.cwd(), 'content', 'pages')

export interface PageData {
  slug: string
  frontmatter: { [key: string]: any }
  content: string
}

export function getPageBySlug(slug: string, subDir?: string): PageData {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = subDir
    ? join(pagesDirectory, subDir, `${realSlug}.md`)
    : join(pagesDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return { slug: realSlug, frontmatter: { ...data }, content }
}

export function getAllPages(subDir?: string): PageData[] {
  const slugs = fs
    .readdirSync(join(pagesDirectory, subDir || ''))
    .filter((slug) => slug.includes('.md'))
  const pages = slugs.map((slug) => getPageBySlug(slug, subDir))

  return pages
}
