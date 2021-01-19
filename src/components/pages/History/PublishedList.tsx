import { Logger } from '@oceanprotocol/lib'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Loader from '../../atoms/Loader'
import AssetQueryList from '../../organisms/AssetQueryList'
import { ewaiCheckResultsForSpamAsync } from '../../../ewai/ewaifilter'

export default function PublishedList(): ReactElement {
  const { ocean, status, accountId } = useOcean()
  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function getPublished() {
      if (!accountId || !ocean) return

      try {
        setIsLoading(true)
        const queryResult = await ocean.assets.ownerAssets(accountId)
        let filteredResultsSet = false
        if (
          process.env.EWAI_CHECK_FOR_SPAM_ASSETS?.toLowerCase() === 'true' &&
          queryResult?.results.length > 0
        ) {
          const filteredResults = await ewaiCheckResultsForSpamAsync(
            queryResult
          )
          setQueryResult(filteredResults)
          filteredResultsSet = true
        }
        if (!filteredResultsSet) {
          setQueryResult(queryResult)
        }
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
    <AssetQueryList queryResult={queryResult} />
  ) : (
    <div>Connect your wallet to see your published data sets.</div>
  )
}
