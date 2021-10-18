import React, { ReactElement, useEffect, useState } from 'react'
import AssetList from '@shared/AssetList/AssetList'
import Button from '@shared/atoms/Button'
import Bookmarks from './Bookmarks'
import {
  generateBaseQuery,
  getFilterTerm,
  queryMetadata
} from '@utils/aquarius'
import { getHighestLiquidityDatatokens } from '@utils/subgraph'
import { DDO, Logger } from '@oceanprotocol/lib'
import { useUserPreferences } from '@context/UserPreferences'
import styles from './Home.module.css'
import { useIsMounted } from '@hooks/useIsMounted'
import { useCancelToken } from '@hooks/useCancelToken'
import { SearchQuery } from '../../models/aquarius/SearchQuery'
import { SortOptions, SortTermOptions } from '../../models/SortAndFilters'
import { BaseQueryParams } from '../../models/aquarius/BaseQueryParams'
import { PagedAssets } from '../../models/PagedAssets'

async function getQueryHighest(
  chainIds: number[]
): Promise<[SearchQuery, string[]]> {
  const dtList = await getHighestLiquidityDatatokens(chainIds)
  const baseQueryParams = {
    chainIds,
    esPaginationOptions: {
      size: dtList.length > 0 ? dtList.length : 1
    },
    filters: [getFilterTerm('dataToken', dtList)]
  } as BaseQueryParams
  const queryHighest = generateBaseQuery(baseQueryParams)

  return [queryHighest, dtList]
}

function sortElements(items: DDO[], sorted: string[]) {
  items.sort(function (a, b) {
    return (
      sorted.indexOf(a.dataToken.toLowerCase()) -
      sorted.indexOf(b.dataToken.toLowerCase())
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
  const [result, setResult] = useState<any>()
  const [loading, setLoading] = useState<boolean>()
  const isMounted = useIsMounted()
  const newCancelToken = useCancelToken()
  useEffect(() => {
    async function init() {
      if (chainIds.length === 0) {
        const result: PagedAssets = {
          results: [],
          page: 0,
          totalPages: 0,
          totalResults: 0
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
          Logger.error(error.message)
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
        isLoading={loading}
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
      chainIds: chainIds,
      esPaginationOptions: { size: 9 },
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

      {queryAndDids && (
        <SectionQueryResult
          title="Highest Liquidity"
          query={queryAndDids[0]}
          queryData={queryAndDids[1]}
        />
      )}

        {queryLatest && (
          <SectionQueryResult
            title="Recently Published"
            query={queryLatest}
            action={
              <Button style="text" to="/search?sort=created&sortOrder=desc">
                All data sets and algorithms →
              </Button>
            }
          />
        )}
      </>


  )
}
