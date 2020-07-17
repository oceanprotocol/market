import React, { ReactElement } from 'react'
import { graphql, PageProps } from 'gatsby'
import Layout from '../Layout'
import styles from './PageMarkdown.module.css'
import Container from '../atoms/Container'

export default function PageTemplateMarkdown(props: PageProps): ReactElement {
  const { html, frontmatter } = (props.data as any).markdownRemark
  const { title, description } = frontmatter

  return (
    <Layout
      title={title}
      description={description}
      uri={props.uri}
      headerCenter
    >
      <Container narrow>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Container>
    </Layout>
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
