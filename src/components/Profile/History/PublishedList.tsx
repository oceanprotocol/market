import { LoggerInstance } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import AssetList from '@shared/AssetList'
import { getPublishedAssets } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import styles from './PublishedList.module.css'
import { useCancelToken } from '@hooks/useCancelToken'
import Filters from '../../Search/Filters'
import { useMarketMetadata } from '@context/MarketMetadata'
import { CancelToken } from 'axios'

export default function PublishedList({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { appConfig } = useMarketMetadata()
  const { chainIds } = useUserPreferences()

  const [queryResult, setQueryResult] = useState<PagedAssets>()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [service, setServiceType] = useState<string>()
  const [access, setAccessType] = useState<string>()
  const newCancelToken = useCancelToken()

  const getPublished = useCallback(
    async (
      accountId: string,
      chainIds: number[],
      page: number,
      service: string,
      access: string,
      cancelToken: CancelToken
    ) => {
      try {
        setIsLoading(true)
        const result = await getPublishedAssets(
          accountId.toLowerCase(),
          chainIds,
          cancelToken,
          page,
          service,
          access
        )
        setQueryResult(result)
      } catch (error) {
        LoggerInstance.error(error.message)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    if (queryResult && queryResult.totalPages < page) setPage(1)
  }, [page, queryResult])

  useEffect(() => {
    if (!accountId) return

    getPublished(accountId, chainIds, page, service, access, newCancelToken())
  }, [
    accountId,
    page,
    appConfig?.metadataCacheUri,
    chainIds,
    newCancelToken,
    getPublished,
    service,
    access
  ])

  return accountId ? (
    <>
      <Filters
        serviceType={service}
        setServiceType={setServiceType}
        accessType={access}
        setAccessType={setAccessType}
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
        noPublisher
      />
    </>
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
