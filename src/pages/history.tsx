import React, { ReactElement } from 'react'
import PageHistory from '../components/pages/History'
import Layout from '../components/Layout'
import { graphql, PageProps } from 'gatsby'

export default function PageGatsbyHistory(props: PageProps): ReactElement {
  const content = (props.data as any).content.edges[0].node.childPagesJson
  const { title, description } = content

  return (
    <Layout title={title} description={description} location={props.location}>
      <PageHistory />
    </Layout>
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
