import { Logger } from '@oceanprotocol/lib'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import React, { ReactElement, useEffect, useState } from 'react'
import AssetList from '../../../organisms/AssetList'
import { getPublishedAssets } from '../../../../utils/aquarius'
import Filters from '../../../templates/Search/Filters'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import styles from './PublishedList.module.css'

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
  const [service, setServiceType] = useState('dataset OR algorithm')

  useEffect(() => {
    async function getPublished() {
      if (!accountId) return

      try {
        setIsLoading(true)
        const result = await getPublishedAssets(
          accountId,
          chainIds,
          page,
          service
        )
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
    <>
      <Filters
        serviceType={service}
        setServiceType={setServiceType}
        isSearch={false}
        className={styles.filters}
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
        className={styles.assets}
      />
    </>
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
