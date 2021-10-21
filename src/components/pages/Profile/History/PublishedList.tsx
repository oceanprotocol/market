import { Logger } from '@oceanprotocol/lib'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import AssetList from '../../../organisms/AssetList'
import { getPublishedAssets } from '../../../../utils/aquarius'
import Filters from '../../../templates/Search/Filters'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import styles from './PublishedList.module.css'
import { useCancelToken } from '../../../../hooks/useCancelToken'
import { PagedAssets } from '../../../../models/PagedAssets'

export default function PublishedList({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { chainIds } = useUserPreferences()

  const [queryResult, setQueryResult] = useState<PagedAssets>()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [service, setServiceType] = useState()
  const [access, setAccsesType] = useState()
  const newCancelToken = useCancelToken()

  const getPublished = useCallback(
    async (accountId, chainIds, page, service, access, cancelToken) => {
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
        Logger.error(error.message)
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
    appConfig.metadataCacheUri,
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
        setAccessType={setAccsesType}
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
