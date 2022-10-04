import React, { ReactElement, useEffect, useState } from 'react'
import Button from '@shared/atoms/Button'
import Bookmarks from './Bookmarks'
import { generateBaseQuery } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { SortTermOptions } from '../../@types/aquarius/SearchQuery'
import TopSales from './TopSales'
import styles from './index.module.css'
import { getQueryHighestAllocation } from '@utils/veAllocation'
import SectionQueryResult from './SectionQueryResult'

export default function HomePage(): ReactElement {
  const [queryLatest, setQueryLatest] = useState<SearchQuery>()
  const [queryMostSales, setQueryMostSales] = useState<SearchQuery>()
  const [queryAndDids, setQueryAndDids] = useState<[SearchQuery, string[]]>()
  const { chainIds } = useUserPreferences()

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
        sortBy: SortTermOptions.Stats
      } as SortOptions
    } as BaseQueryParams
    setQueryMostSales(generateBaseQuery(baseParamsSales))
    getQueryHighestAllocation(chainIds).then((results) => {
      setQueryAndDids(results)
    })
  }, [chainIds])

  return (
    <>
      <section className={styles.section}>
        <h3>Bookmarks</h3>
        <Bookmarks />
      </section>

      <SectionQueryResult
        title="Highest veOCEAN Allocations"
        query={queryAndDids?.[0]}
        queryData={queryAndDids?.[1]}
      />

      <SectionQueryResult title="Most Sales" query={queryMostSales} />

      <TopSales title="Publishers With Most Sales" />

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
