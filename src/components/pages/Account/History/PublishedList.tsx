import { Logger } from '@oceanprotocol/lib'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import React, { ReactElement, useEffect, useState } from 'react'
import AssetList from '../../../organisms/AssetList'
import axios from 'axios'
import {
  queryMetadata,
  transformChainIdsListToQuery
} from '../../../../utils/aquarius'
import { useWeb3 } from '../../../../providers/Web3'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import { useUserPreferences } from '../../../../providers/UserPreferences'

export default function PublishedList(): ReactElement {
  const { accountId } = useWeb3()
  const { appConfig } = useSiteMetadata()
  const { chainIds } = useUserPreferences()

  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    async function getPublished() {
      if (!accountId) return
      const queryPublishedAssets = {
        page: page,
        offset: 9,
        query: {
          query_string: {
            query: `(publicKey.owner:${accountId}) AND (${transformChainIdsListToQuery(
              chainIds
            )})`
          }
        },
        sort: { created: -1 }
      }
      try {
        const source = axios.CancelToken.source()

        queryResult || setIsLoading(true)
        const result = await queryMetadata(queryPublishedAssets, source.token)
        setQueryResult(result)
      } catch (error) {
        Logger.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getPublished()
  }, [accountId, page, appConfig.metadataCacheUri, chainIds])

  return accountId ? (
    <AssetList
      assets={queryResult?.results}
      isLoading={isLoading}
      showPagination
      page={queryResult?.page}
      totalPages={queryResult?.totalPages}
      onPageChange={(newPage) => {
        setPage(newPage)
      }}
    />
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
