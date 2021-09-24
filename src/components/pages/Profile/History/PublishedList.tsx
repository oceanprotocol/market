import { Logger } from '@oceanprotocol/lib'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import React, { ReactElement, useEffect, useState } from 'react'
import AssetList from '../../../organisms/AssetList'
import { getPublishedAssets } from '../../../../utils/aquarius'
import Filters from '../../../templates/Search/Filters'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import styles from './PublishedList.module.css'
import axios, { CancelToken } from 'axios'

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
  const [access, setAccsesType] = useState('access OR compute')

  async function getPublished(token: CancelToken) {
    try {
      setIsLoading(true)
      const result = await getPublishedAssets(
        accountId,
        chainIds,
        token,
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
  }

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()
    async function fetchPublishedAssets() {
      await getPublished(cancelTokenSource.token)
    }
    if (page !== 1) {
      setPage(1)
    } else {
      fetchPublishedAssets()
    }
    return () => {
      cancelTokenSource.cancel()
    }
  }, [service, access])

  useEffect(() => {
    if (!accountId) return

    const cancelTokenSource = axios.CancelToken.source()

    async function fetchPublishedAssets() {
      await getPublished(cancelTokenSource.token)
    }
    fetchPublishedAssets()

    return () => {
      cancelTokenSource.cancel()
    }
  }, [accountId, page, appConfig.metadataCacheUri, chainIds])

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
