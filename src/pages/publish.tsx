import React, { ReactElement } from 'react'
import PagePublish from '../components/pages/Publish'
import Page from '../components/templates/Page'
import { graphql, PageProps } from 'gatsby'
import { useEwaiInstance } from '../ewai/client/ewai-js'

export default function PageGatsbyPublish(props: PageProps): ReactElement {
  const content = (props.data as any).content.edges[0].node.childPagesJson
  const ewaiInstance = useEwaiInstance()
  const { title, description } = content

  return (
    <Page title={title} description={description} uri={props.uri}>
      <PagePublish content={content} ewaiInstance={ewaiInstance} />
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
                rows
                required
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
