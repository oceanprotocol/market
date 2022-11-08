import { useUserPreferences } from '@context/UserPreferences'
import { useCancelToken } from '@hooks/useCancelToken'
import { useIsMounted } from '@hooks/useIsMounted'
import { LoggerInstance } from '@oceanprotocol/lib'
import AssetList from '@shared/AssetList'
import Tooltip from '@shared/atoms/Tooltip'
import Markdown from '@shared/Markdown'
import { queryMetadata } from '@utils/aquarius'
import { sortAssets } from '@utils/index'
import React, { ReactElement, useState, useEffect } from 'react'
import styles from './index.module.css'

export default function SectionQueryResult({
  title,
  query,
  action,
  queryData,
  tooltip
}: {
  title: ReactElement | string
  query: SearchQuery
  action?: ReactElement
  queryData?: string[]
  tooltip?: string
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const [result, setResult] = useState<PagedAssets>()
  const [loading, setLoading] = useState<boolean>()
  const isMounted = useIsMounted()
  const newCancelToken = useCancelToken()

  useEffect(() => {
    if (!query) return

    async function init() {
      if (chainIds.length === 0) {
        const result: PagedAssets = {
          results: [],
          page: 0,
          totalPages: 0,
          totalResults: 0,
          aggregations: undefined
        }
        setResult(result)
        setLoading(false)
      } else {
        try {
          setLoading(true)

          const result = await queryMetadata(query, newCancelToken())
          if (!isMounted()) return
          if (queryData && result?.totalResults > 0) {
            const sortedAssets = sortAssets(result.results, queryData)
            const overflow = sortedAssets.length - 6
            sortedAssets.splice(sortedAssets.length - overflow, overflow)
            result.results = sortedAssets
          }
          setResult(result)
          setLoading(false)
        } catch (error) {
          LoggerInstance.error(error.message)
        }
      }
    }
    init()
  }, [chainIds.length, isMounted, newCancelToken, query, queryData])

  return (
    <section className={styles.section}>
      <h3>
        {title} {tooltip && <Tooltip content={<Markdown text={tooltip} />} />}
      </h3>

      <AssetList
        assets={result?.results}
        showPagination={false}
        isLoading={loading || !query}
      />

      {action && action}
    </section>
  )
}
