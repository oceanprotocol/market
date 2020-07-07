import React, { ReactElement } from 'react'
import { PageProps, graphql } from 'gatsby'
import Layout from '../Layout'
import AssetContent from '../organisms/AssetContent'

export default function AssetDetailsTemplate(props: PageProps): ReactElement {
  const { asset } = props.data as any

  return (
    <Layout title={asset.main.name} uri={props.path}>
      <AssetContent did={asset.did} metadata={asset} />
    </Layout>
  )
}

export const templateQuery = graphql`
  query AssetByDid($did: String!) {
    asset(did: { eq: $did }) {
      did
      main {
        type
        name
        dateCreated
        author
        license
        price
        datePublished
        files {
          index
          contentType
        }
      }
      additionalInformation {
        description
        deliveryType
        termsAndConditions
        access
      }
    }
  }
`
