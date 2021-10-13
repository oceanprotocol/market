import React, { ReactElement } from 'react'
import PagePublish from '../components/Publish'
import Page from '@shared/Page'
import { graphql, PageProps } from 'gatsby'
import OceanProvider from '@context/Ocean'

export default function PageGatsbyPublish(props: PageProps): ReactElement {
  const content = (props.data as any).content.edges[0].node.childPublishJson
  const { title, description } = content

  return (
    <OceanProvider>
      <Page title={title} description={description} uri={props.uri}>
        <PagePublish content={content} />
      </Page>
    </OceanProvider>
  )
}

export const contentQuery = graphql`
  query PublishPageQuery {
    content: allFile(
      filter: { relativePath: { eq: "pages/publish/index.json" } }
    ) {
      edges {
        node {
          childPublishJson {
            title
            description
            warning
          }
        }
      }
    }
  }
`
