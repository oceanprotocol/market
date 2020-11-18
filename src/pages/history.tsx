import React, { ReactElement } from 'react'
import PageHistory from '../components/pages/History'
import Page from '../components/templates/Page'
import { graphql, PageProps } from 'gatsby'

export default function PageGatsbyHistory(props: PageProps): ReactElement {
  const content = (props.data as any).content.edges[0].node.childPagesJson
  const { title, description } = content

  return (
    <Page title={title} description={description} uri={props.uri}>
      <PageHistory />
    </Page>
  )
}

export const contentQuery = graphql`
  query HistoryPageQuery {
    content: allFile(filter: { relativePath: { eq: "pages/history.json" } }) {
      edges {
        node {
          childPagesJson {
            title
            description
          }
        }
      }
    }
  }
`
