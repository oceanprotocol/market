import React, { useEffect, useState, ReactElement } from 'react'
import Loader from '../atoms/Loader'
import { useOcean } from '@oceanprotocol/react'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatastore/MetadataStore'
import AssetList from './AssetList'

export default function ConsumedList(): ReactElement {
  const { ocean, status, accountId } = useOcean()
  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function getConsumed() {
      if (!accountId || !ocean) return

      setIsLoading(true)

      // const queryResult = await

      setQueryResult(queryResult)

      setIsLoading(false)
    }
    getConsumed()
  }, [ocean, status, accountId])

  return isLoading ? (
    <Loader />
  ) : accountId && ocean ? (
    <AssetList queryResult={queryResult} />
  ) : (
    <div>Connect your wallet to see your published data sets.</div>
  )
}
