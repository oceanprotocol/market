import React, { ReactElement } from 'react'
import { getPageBySlug, getAllPages, PageData } from '@utils/markdownPages'
import Page from '@shared/Page'
import styles from '@shared/Page/PageMarkdown.module.css'
import Container from '@shared/atoms/Container'
import { useRouter } from 'next/router'
import { markdownToHtml } from '@utils/markdown'

export default function PageMarkdown(page: PageData): ReactElement {
  const router = useRouter()
  if (!page || page.content === '') return null

  const { title, description } = page.frontmatter
  const { content } = page

  return (
    <Page
      title={title}
      description={description}
      uri={router.asPath}
      headerCenter
    >
      <Container narrow>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Container>
    </Page>
  )
}

export async function getStaticProps({
  params
}: {
  params: { slug: string }
}): Promise<{ props: PageData }> {
  const page = getPageBySlug(params.slug)
  const content = markdownToHtml(page?.content || '')

  return {
    props: { ...page, content }
  }
}

export async function getStaticPaths(): Promise<{
  paths: {
    params: {
      slug: string
    }
  }[]
  fallback: boolean
}> {
  const pages = getAllPages()

  return {
    paths: pages.map((page) => {
      return {
        params: { slug: page.slug }
      }
    }),
    fallback: false
  }
}
