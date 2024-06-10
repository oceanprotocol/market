import React, { ReactElement, useEffect, useState } from 'react'
import Button from '@shared/atoms/Button'
import Bookmarks from './Bookmarks'
import { generateBaseQuery, getFilterTerm } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { SortTermOptions } from '../../@types/aquarius/SearchQuery'
import TopSales from './TopSales'
import TopTags from './TopTags'
import SectionQueryResult from './SectionQueryResult'
import styles from './index.module.css'

export default function HomePage(): ReactElement {
  const { chainIds } = useUserPreferences()

  const [queryLatest, setQueryLatest] = useState<SearchQuery>()
  const [queryMostSales, setQueryMostSales] = useState<SearchQuery>()
  const [queryMostAllocation, setQueryMostAllocation] = useState<SearchQuery>()

  const filterDatasets: unknown[] = []

  useEffect(() => {
    const baseParams = {
      chainIds,
      esPaginationOptions: {
        size: 6
      },
      filters: filterDatasets,
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
  }, [chainIds])

  return (
    <>
      <section className={styles.section}>
        <h3>Your Bookmarks</h3>
        <Bookmarks />
      </section>

      <SectionQueryResult title="Most Sales" query={queryMostSales} />
      {/* <MostViews /> */}
      <TopSales title="Publishers With Most Sales" />
      <TopTags title="Top Tags By Sales" />

      <SectionQueryResult
        title="Recently Published"
        query={queryLatest}
        action={
          <Button style="text" to="/search?sort=nft.created&sortOrder=desc">
            All datasets →
          </Button>
        }
      />
    </>
  )
}
