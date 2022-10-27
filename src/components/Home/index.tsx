import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import Button from '@shared/atoms/Button'
import Bookmarks from './Bookmarks'
import { generateBaseQuery, getFilterTerm } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { SortTermOptions } from '../../@types/aquarius/SearchQuery'
import TopSales from './TopSales'
import TopTags from './TopTags'
import SectionQueryResult from './SectionQueryResult'
import styles from './index.module.css'
import Allocations from './Allocations'
import { useAbortController } from '@hooks/useAbortController'
import fetch from 'cross-fetch'

export default function HomePage(): ReactElement {
  const { chainIds } = useUserPreferences()

  const [queryLatest, setQueryLatest] = useState<SearchQuery>()
  const [queryMostSales, setQueryMostSales] = useState<SearchQuery>()
  const [queryMostViewed, setQueryMostViewed] = useState<SearchQuery>()
  const [queryMostAllocation, setQueryMostAllocation] = useState<SearchQuery>()
  const [mostViewedDids, setMostViewedDids] = useState<string[]>()
  const newAbortController = useAbortController()

  const getMostViewed = useCallback(async () => {
    const reponse = await fetch(
      'https://market-analytics.oceanprotocol.com/pages?limit=6',
      { signal: newAbortController() }
    )
    const body = (await reponse.json()) as PageViews[]
    const dids = body.map((x: PageViews) => x.did)
    setMostViewedDids(dids)
    const baseParams = {
      esPaginationOptions: {
        size: 6
      },
      filters: [getFilterTerm('_id', dids)]
    } as BaseQueryParams
    setQueryMostViewed(generateBaseQuery(baseParams))
  }, [newAbortController])

  useEffect(() => {
    getMostViewed()
  }, [getMostViewed])
  useEffect(() => {
    const baseParams = {
      chainIds,
      esPaginationOptions: {
        size: 6
      },
      sortOptions: {
        sortBy: SortTermOptions.Created
      } as SortOptions
    } as BaseQueryParams
    setQueryLatest(generateBaseQuery(baseParams))

    const baseParamsSales = {
      chainIds,
      esPaginationOptions: {
        size: 6
      },
      sortOptions: {
        sortBy: SortTermOptions.Orders
      } as SortOptions
    } as BaseQueryParams
    setQueryMostSales(generateBaseQuery(baseParamsSales))
    const baseParamsAllocation = {
      chainIds,
      esPaginationOptions: {
        size: 6
      },
      sortOptions: {
        sortBy: SortTermOptions.Allocated
      } as SortOptions
    } as BaseQueryParams
    setQueryMostAllocation(generateBaseQuery(baseParamsAllocation))
  }, [chainIds, getMostViewed])

  return (
    <>
      <section className={styles.section}>
        <h3>Your Bookmarks</h3>
        <Bookmarks />
      </section>

      <Allocations />

      <SectionQueryResult
        title="Highest veOCEAN Allocations"
        query={queryMostAllocation}
      />

      <SectionQueryResult title="Most Sales" query={queryMostSales} />
      <SectionQueryResult
        title="Most Viewed"
        query={queryMostViewed}
        queryData={mostViewedDids}
        tooltip="Assets with the most traffic on all supported chains. It is not influenced by selected networks"
      />

      <TopSales title="Publishers With Most Sales" />
      <TopTags title="Top Tags By Sales" />

      <SectionQueryResult
        title="Recently Published"
        query={queryLatest}
        action={
          <Button style="text" to="/search?sort=nft.created&sortOrder=desc">
            All datasets and algorithms →
          </Button>
        }
      />
    </>
  )
}
