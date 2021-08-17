import React, { ReactElement } from 'react'
import { graphql, PageProps } from 'gatsby'
import Page from '../components/templates/Page'
import PageTutorial from '../components/pages/Tutorial'

export default function PageGatsbyTutorial(props: PageProps): ReactElement {
  const { title, description } = (props.data as any).content.edges[0].node
    .childTutorialJson
  return (
    <Page title={title} description={description} uri={props.uri} headerCenter>
      <PageTutorial />
    </Page>
  )
}

export const contentQuery = graphql`
  query TutorialPageQuery {
    content: allFile(
      filter: { relativePath: { eq: "pages/tutorial/index.json" } }
    ) {
      edges {
        node {
          childTutorialJson {
            title
            description
          }
        }
      }
    }
  }
`
