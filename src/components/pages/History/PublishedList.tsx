import { Logger } from '@oceanprotocol/lib'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Loader from '../../atoms/Loader'
import AssetList from '../../organisms/AssetList'
import axios from 'axios'
import { queryMetadata } from '../../../utils/aquarius'

export default function PublishedList(): ReactElement {
  const { accountId } = useOcean()
  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [isLoading, setIsLoading] = useState(false)
  const { config } = useOcean()
  const source = axios.CancelToken.source()
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    async function getPublished() {
      if (!accountId) return
      const queryPublishedAssets = {
        page: page,
        offset: 9,
        query: {
          nativeSearch: 1,
          query_string: {
            query: `(publicKey.owner:${accountId})`
          }
        },
        sort: { 'price.ocean': -1 }
      }
      try {
        setIsLoading(true)
        const queryResult = await queryMetadata(
          queryPublishedAssets as any,
          config.metadataCacheUri,
          source.token
        )
        setQueryResult(queryResult)
      } catch (error) {
        Logger.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getPublished()
  }, [accountId, page])

  return isLoading ? (
    <Loader />
  ) : accountId && queryResult ? (
    <AssetList
      assets={queryResult.results}
      showPagination
      page={queryResult.page}
      totalPages={queryResult.totalPages}
      onPageChange={(newPage) => {
        setPage(newPage)
      }}
    />
  ) : (
    <div>Connect your wallet to see your published data sets.</div>
  )
}
