import React, { useEffect, useState, ReactElement } from 'react'
import Loader from '../atoms/Loader'
import { useOcean } from '@oceanprotocol/react'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatastore/MetadataStore'
import AssetList from './AssetList'

export default function PublishedList(): ReactElement {
  const { ocean, status, account, accountId } = useOcean()
  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function getPublished() {
      if (!account || !accountId || !ocean) return

      setIsLoading(true)

      // const queryResult = await

      setQueryResult(queryResult)

      setIsLoading(false)
    }
    getPublished()
  }, [accountId, ocean, status])

  return isLoading ? (
    <Loader />
  ) : queryResult ? (
    <AssetList queryResult={queryResult} />
  ) : (
    <div>Connect your wallet to see your published data sets.</div>
  )
}
