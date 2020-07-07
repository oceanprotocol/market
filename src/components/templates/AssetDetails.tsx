import React, { ReactElement } from 'react'
import { PageProps, graphql } from 'gatsby'
import Layout from '../Layout'
import AssetContent from '../organisms/AssetContent'

export default function AssetDetailsTemplate(props: PageProps): ReactElement {
  const { oceanAsset } = props.data as any

  return (
    <Layout title={oceanAsset.main.name} uri={props.path}>
      <AssetContent did={oceanAsset.did} metadata={oceanAsset} />
    </Layout>
  )
}

export const templateQuery = graphql`
  query OceanAssetByDid($did: String!) {
    oceanAsset(did: { eq: $did }) {
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
