import React, { ReactElement, useEffect, useState } from 'react'
import AssetList from '@shared/AssetList'
import Button from '@shared/atoms/Button'
import Bookmarks from './Bookmarks'
import {
  generateBaseQuery,
  getFilterTerm,
  queryMetadata
} from '@utils/aquarius'
import { getHighestLiquidityDatatokens } from '@utils/subgraph'
import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import { useUserPreferences } from '@context/UserPreferences'
import styles from './index.module.css'
import { useIsMounted } from '@hooks/useIsMounted'
import { useCancelToken } from '@hooks/useCancelToken'
import { SortTermOptions } from '../../@types/aquarius/SearchQuery'
import PublishersWithMostSales from './PublishersWithMostSales'

async function getQueryHighest(
  chainIds: number[]
): Promise<[SearchQuery, string[]]> {
  const dtList = await getHighestLiquidityDatatokens(chainIds)
  const baseQueryParams = {
    chainIds,
    esPaginationOptions: {
      size: dtList.length > 0 ? dtList.length : 1
    },
    filters: [getFilterTerm('services.datatokenAddress', dtList)]
  } as BaseQueryParams
  const queryHighest = generateBaseQuery(baseQueryParams)
  return [queryHighest, dtList]
}

function sortElements(items: Asset[], sorted: string[]) {
  items.sort(function (a, b) {
    return (
      sorted.indexOf(a.services[0].datatokenAddress.toLowerCase()) -
      sorted.indexOf(b.services[0].datatokenAddress.toLowerCase())
    )
  })
  return items
}

function SectionQueryResult({
  title,
  query,
  action,
  queryData
}: {
  title: ReactElement | string
  query: SearchQuery
  action?: ReactElement
  queryData?: string[]
}) {
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
            const sortedAssets = sortElements(result.results, queryData)
            const overflow = sortedAssets.length - 9
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
      <h3>{title}</h3>

      <AssetList
        assets={result?.results}
        showPagination={false}
        isLoading={loading || !query}
      />

      {action && action}
    </section>
  )
}

export default function HomePage(): ReactElement {
  const [queryAndDids, setQueryAndDids] = useState<[SearchQuery, string[]]>()
  const [queryLatest, setQueryLatest] = useState<SearchQuery>()
  const { chainIds } = useUserPreferences()

  useEffect(() => {
    getQueryHighest(chainIds).then((results) => {
      setQueryAndDids(results)
    })

    const baseParams = {
      chainIds,
      esPaginationOptions: {
        size: 9
      },
      sortOptions: {
        sortBy: SortTermOptions.Created
      } as SortOptions
    } as BaseQueryParams
    setQueryLatest(generateBaseQuery(baseParams))
  }, [chainIds])

  return (
    <>
      <section className={styles.section}>
        <h3>Bookmarks</h3>
        <Bookmarks />
      </section>

      <SectionQueryResult
        title="Highest Liquidity"
        query={queryAndDids?.[0]}
        queryData={queryAndDids?.[1]}
      />

      <SectionQueryResult
        title="Recently Published"
        query={queryLatest}
        action={
          <Button style="text" to="/search?sort=nft.created&sortOrder=desc">
            All data sets and algorithms →
          </Button>
        }
      />

      <PublishersWithMostSales title="Publishers With Most Sales" />
    </>
  )
}
