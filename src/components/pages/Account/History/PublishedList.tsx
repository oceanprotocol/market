import { Logger } from '@oceanprotocol/lib'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import React, { ReactElement, useEffect, useState, useReducer } from 'react'
import AssetList from '../../../organisms/AssetList'
import axios from 'axios'
import {
  queryMetadata,
  transformChainIdsListToQuery
} from '../../../../utils/aquarius'
import ServiceFilter from '../../../templates/Search/filterService'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import { useUserPreferences } from '../../../../providers/UserPreferences'

export default function PublishedList({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { chainIds } = useUserPreferences()

  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [service, setServiceType] = useState<string>()

  useEffect(() => {
    async function getPublished() {
      const serviceFiter =
        service === undefined ? 'dataset OR algorithm' : `${service}`
      if (!accountId) return
      const queryPublishedAssets = {
        page: page,
        offset: 9,
        query: {
          query_string: {
            query: `(publicKey.owner:${accountId}) AND (service.attributes.main.type:${serviceFiter}) AND (${transformChainIdsListToQuery(
              chainIds
            )})`
          }
        },
        sort: { created: -1 }
      }
      try {
        const source = axios.CancelToken.source()

        setIsLoading(true)
        const result = await queryMetadata(queryPublishedAssets, source.token)
        setQueryResult(result)
      } catch (error) {
        Logger.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getPublished()
  }, [accountId, page, appConfig.metadataCacheUri, chainIds, service])

  return accountId ? (
    <div>
      <ServiceFilter
        serviceType={service}
        setServiceType={setServiceType}
        isSearch={false}
      />
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
    </div>
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
