import React, { useState, useEffect, ReactElement } from 'react'
import { Router } from '@reach/router'
import AssetContent from '../organisms/AssetContent'
import Page from './Page'
import { MetadataMarket } from '../../@types/MetaData'
import { MetadataCache, Logger, DDO } from '@oceanprotocol/lib'
import Alert from '../atoms/Alert'
import Loader from '../atoms/Loader'
import { useAsset, useOcean } from '@oceanprotocol/react'
import get3BoxProfile from '../../utils/profile'

export default function PageTemplateAssetDetails({
  did,
  uri
}: {
  did: string
  uri: string
}): ReactElement {
  const { config, accountId } = useOcean()
  const { isInPurgatory, purgatoryData } = useAsset()
  const [metadata, setMetadata] = useState<MetadataMarket>()
  const [title, setTitle] = useState<string>()
  const [error, setError] = useState<string>()
  const [ddo, setDdo] = useState<DDO>()

  useEffect(() => {
    if (!accountId) return
    async function init() {
      const prof = await get3BoxProfile(accountId, null)
      console.log(prof)
    }
    init()
  }, [accountId])

  useEffect(() => {
    if (!config?.metadataCacheUri) return

    async function init() {
      if (ddo) return

      try {
        const metadataCache = new MetadataCache(config.metadataCacheUri, Logger)
        const ddo = await metadataCache.retrieveDDO(did)

        if (!ddo) {
          setTitle('Could not retrieve asset')
          setError(
            `The DDO for ${did} was not found in MetadataCache. If you just published a new data set, wait some seconds and refresh this page.`
          )
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

    // Periodically try to get DDO when not present yet
    const timer = !ddo && setInterval(() => init(), 5000)
    return () => clearInterval(timer)
  }, [ddo, did, config.metadataCacheUri])

  return did && metadata ? (
    <>
      {isInPurgatory && purgatoryData && (
        <Alert
          title="Data Set In Purgatory"
          badge={`Reason: ${purgatoryData.reason}`}
          text="Except for removing liquidity, no further actions are permitted on this data set and it will not be returned in any search. For more details go to [list-purgatory](https://github.com/oceanprotocol/list-purgatory)."
          state="error"
        />
      )}
      <Page title={title} uri={uri}>
        <Router basepath="/asset">
          <AssetContent
            ddo={ddo}
            metadata={metadata as MetadataMarket}
            path=":did"
          />
        </Router>
      </Page>
    </>
  ) : error ? (
    <Page title={title} noPageHeader uri={uri}>
      <Alert title={title} text={error} state="error" />
    </Page>
  ) : (
    <Page title={undefined} uri={uri}>
      <Loader />
    </Page>
  )
}
