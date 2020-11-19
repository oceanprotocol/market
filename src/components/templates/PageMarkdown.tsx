import React, { ReactElement } from 'react'
import { graphql, PageProps } from 'gatsby'
import Page from './Page'
import styles from './PageMarkdown.module.css'
import Container from '../atoms/Container'

export default function PageTemplateMarkdown(props: PageProps): ReactElement {
  const { html, frontmatter } = (props.data as any).markdownRemark
  const { title, description } = frontmatter

  return (
    <Page title={title} description={description} uri={props.uri} headerCenter>
      <Container narrow>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Container>
    </Page>
  )
}

export const pageQuery = graphql`
  query PageMarkdownBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        description
      }
      fields {
        slug
      }
    }
  }
`
