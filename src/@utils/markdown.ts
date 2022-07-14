import remark from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'

export function isHtml(str: string): boolean {
  const doc = new DOMParser().parseFromString(str, 'text/html')
  return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1)
}

export function markdownToHtml(markdown: string): string {
  const result = remark()
    .use(remarkGfm)
    .use(remarkHtml) // serializes through remark-rehype and rehype-stringify
    .processSync(markdown).contents

  return result.toString()
}
