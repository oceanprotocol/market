import React, { ReactElement } from 'react'
import { graphql, PageProps } from 'gatsby'
import Page from './Page'
import { content } from './PageMarkdown.module.css'

export default function PageTemplateMarkdown(props: PageProps): ReactElement {
  const { html, frontmatter } = (props.data as any).markdownRemark
  const { title, description } = frontmatter

  return (
    <Page
      title={title}
      description={description}
      uri={props.uri}
      headerCenter
      narrow
    >
      <div className={content} dangerouslySetInnerHTML={{ __html: html }} />
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
