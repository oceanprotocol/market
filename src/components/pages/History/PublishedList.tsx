import { Logger } from '@oceanprotocol/lib'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import React, { ReactElement, useEffect, useState } from 'react'
import Loader from '../../atoms/Loader'
import AssetList from '../../organisms/AssetList'
import axios from 'axios'
import { queryMetadata } from '../../../utils/aquarius'
import { useWeb3 } from '../../../providers/Web3'
import { useOcean } from '../../../providers/Ocean'

export default function PublishedList(): ReactElement {
  const { accountId } = useWeb3()
  const { config } = useOcean()

  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState<number>(1)

  const source = axios.CancelToken.source()

  useEffect(() => {
    async function getPublished() {
      if (!accountId) return
      const queryPublishedAssets = {
        page: page,
        offset: 9,
        query: {
          query_string: {
            query: `(publicKey.owner:${accountId})`
          }
        },
        sort: { 'price.ocean': -1 }
      }
      try {
        queryResult || setIsLoading(true)
        const result = await queryMetadata(
          queryPublishedAssets,
          config.metadataCacheUri,
          source.token
        )
        setQueryResult(result)
      } catch (error) {
        Logger.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getPublished()
  }, [accountId, page, config.metadataCacheUri])

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
