import React, { useState, useEffect, ReactElement } from 'react'
import { Router } from '@reach/router'
import AssetContent from '../../components/organisms/AssetContent'
import Layout from '../../components/Layout'
import { MetadataMarket } from '../../@types/Metadata'
import { MetadataStore, Logger, DDO } from '@oceanprotocol/lib'
import Alert from '../../components/atoms/Alert'
import Loader from '../../components/atoms/Loader'
import { useOcean, useMetadata } from '@oceanprotocol/react'

export default function PageTemplateAssetDetails({
  did,
  uri
}: {
  did: string
  uri: string
}): ReactElement {
  const { config } = useOcean()
  const metadataMinimal = useMetadata(did)
  const [metadata, setMetadata] = useState<MetadataMarket>()
  const [title, setTitle] = useState<string>()
  const [error, setError] = useState<string>()
  const [ddo, setDdo] = useState<DDO>()

  useEffect(() => {
    async function init() {
      try {
        const metadataStore = new MetadataStore(config.metadataStoreUri, Logger)
        const ddo = await metadataStore.retrieveDDO(did)

        if (!ddo) {
          setTitle('Could not retrieve asset')
          setError('The DDO was not found in MetadataStore.')
          return
        }

        setDdo(ddo)

        const { attributes } = ddo.findServiceByType('metadata')
        setTitle(attributes.main.name)
        setMetadata((attributes as unknown) as MetadataMarket)
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
    <Layout title={metadataMinimal.title} uri={uri}>
      <Loader />
    </Layout>
  )
}
