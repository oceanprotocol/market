import React, { useState, useEffect, ReactElement } from 'react'
import { Router } from '@reach/router'
import AssetContent from '../../components/organisms/AssetContent'
import Layout from '../../components/Layout'
import { MetadataMarket, ServiceMetadataMarket } from '../../@types/Metadata'
import { MetadataStore, Logger, DDO } from '@oceanprotocol/lib'
import Alert from '../../components/atoms/Alert'
import Loader from '../../components/atoms/Loader'
import { useOcean } from '@oceanprotocol/react'

export default function PageTemplateAssetDetails({
  did,
  uri
}: {
  did: string
  uri: string
}): ReactElement {
  const { config } = useOcean()
  const [metadata, setMetadata] = useState<MetadataMarket>()
  const [title, setTitle] = useState<string>()
  const [error, setError] = useState<string>()
  const [ddo, setDdo] = useState<DDO>()

  useEffect(() => {
    async function init() {
      try {
        const metadataStore = new MetadataStore(config.metadataStoreUri, Logger)
        const ddo = await metadataStore.retrieveDDO(did)
        setDdo(ddo)

        if (!ddo) {
          setTitle('Could not retrieve asset')
          setError('The DDO was not found in MetadataStore.')
          return
        }

        const { attributes }: ServiceMetadataMarket = ddo.findServiceByType(
          'metadata'
        )

        setTitle(attributes.main.name)
        setMetadata(attributes)
      } catch (error) {
        setTitle('Error retrieving asset')
        setError(error.message)
      }
    }
    init()
  }, [did])

  return did && metadata ? (
    <Layout title={title} uri={uri}>
      <Router basepath="/asset">
        <AssetContent
          ddo={ddo}
          metadata={metadata as MetadataMarket}
          path=":did"
        />
      </Router>
    </Layout>
  ) : error ? (
    <Layout title={title} noPageHeader uri={uri}>
      <Alert title={title} text={error} state="error" />
    </Layout>
  ) : (
    <Layout title="Loading..." uri={uri}>
      <Loader />
    </Layout>
  )
}
