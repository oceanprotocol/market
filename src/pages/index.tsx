import React, { ReactElement } from 'react'
import { PageProps, graphql } from 'gatsby'
import PageHome from '../components/pages/Home'
import { useSiteMetadata } from '../hooks/useSiteMetadata'
import Layout from '../components/Layout'

export default function PageGatsbyHome(props: PageProps): ReactElement {
  const { siteTitle, siteTagline } = useSiteMetadata()
  const assets = (props.data as any).allOceanAsset.edges

  return (
    <Layout title={siteTitle} description={siteTagline} uri={props.uri}>
      <PageHome assets={assets} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query PageHomeQuery {
    allOceanAsset {
      edges {
        node {
          did
          main {
            type
            name
            dateCreated
            author
            price
            datePublished
          }
          additionalInformation {
            description
            access
          }
        }
      }
    }
  }
`
