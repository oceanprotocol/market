import React, { ReactElement, useState } from 'react'
import { graphql, PageProps } from 'gatsby'
import Page from '../components/templates/Page'
import PageTutorial from '../components/pages/Tutorial'
import { DDO } from '@oceanprotocol/lib'
import Permission from '../components/organisms/Permission'
import AssetProvider from '../providers/Asset'
import OceanProvider from '../providers/Ocean'

export default function PageGatsbyTutorial(props: PageProps): ReactElement {
  const [tutorialDdo, setTutorialDdo] = useState<DDO>()
  const { title, description } = (props.data as any).content.edges[0].node
    .childTutorialJson

  return (
    <Page title={title} description={description} uri={props.uri} headerCenter>
      <Permission eventType="browse">
        <AssetProvider asset={tutorialDdo?.id}>
          <OceanProvider>
            <PageTutorial setTutorialDdo={setTutorialDdo} />
          </OceanProvider>
        </AssetProvider>
      </Permission>
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
