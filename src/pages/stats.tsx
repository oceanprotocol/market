import React, { ReactElement } from 'react'
import PageStats from '../components/pages/Stats'
import Page from '../components/templates/Page'
import { PageProps, useStaticQuery, graphql } from 'gatsby'

export const contentQuery = graphql`
  query StatsPageQuery {
    content: allFile(filter: { relativePath: { eq: "pages/stats.json" } }) {
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

export default function PageGatsbyStats(props: PageProps): ReactElement {
  const content = (props.data as any).content.edges[0].node.childPagesJson
  const { title, description } = content

  return (
    <Page title={title} description={description} uri={props.uri}>
      <PageStats />
    </Page>
  )
}
