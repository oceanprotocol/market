import { Logger } from '@oceanprotocol/lib'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatastore/MetadataStore'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Loader from '../../atoms/Loader'
import AssetList from '../../organisms/AssetList'

export default function PublishedList(): ReactElement {
  const { ocean, status, accountId } = useOcean()
  // TODO: wait for ocean-lib-js with https://github.com/oceanprotocol/ocean-lib-js/pull/308
  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function getPublished() {
      if (!accountId || !ocean) return

      try {
        setIsLoading(true)
        const queryResult = await ocean.assets.ownerAssets(accountId)
        setQueryResult(queryResult)
      } catch (error) {
        Logger.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getPublished()
  }, [ocean, status, accountId])

  return isLoading ? (
    <Loader />
  ) : accountId && ocean ? (
    <AssetList queryResult={queryResult} />
  ) : (
    <div>Connect your wallet to see your published data sets.</div>
  )
}
