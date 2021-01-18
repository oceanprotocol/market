import React, { ReactElement } from 'react'
import PagePublish from '../components/pages/Publish'
import Page from '../components/templates/Page'
import { graphql, PageProps } from 'gatsby'

export default function PageGatsbyPublish(props: PageProps): ReactElement {
  const content = (props.data as any).content.edges[0].node.childPagesJson
  const { title, description } = content

  return (
    <Page title={title} description={description} uri={props.uri}>
      <PagePublish content={content} />
    </Page>
  )
}

export const contentQuery = graphql`
  query PublishPageQuery {
    content: allFile(filter: { relativePath: { eq: "pages/publish.json" } }) {
      edges {
        node {
          childPagesJson {
            title
            description
            warning
            form {
              title
              data {
                name
                placeholder
                label
                help
                type
                required
                sortOptions
                options
              }
              success
            }
          }
        }
      }
    }
  }
`
