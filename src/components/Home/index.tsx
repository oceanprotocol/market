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
import { useWeb3 } from '@context/Web3'
import { getOwnAllocations } from '@utils/veAllocation'

export default function HomePage(): ReactElement {
  const { accountId } = useWeb3()
  const [queryLatest, setQueryLatest] = useState<SearchQuery>()
  const [queryMostSales, setQueryMostSales] = useState<SearchQuery>()
  const [queryMostAllocation, setQueryMostAllocation] = useState<SearchQuery>()
  const [queryAssetsAllocation, setQueryAssetsAllocation] =
    useState<SearchQuery>()
  const [hasAllocations, setHasAllocations] = useState(false)
  const { chainIds } = useUserPreferences()

  useEffect(() => {
    async function init() {
      if (!accountId) return
      const allocations = await getOwnAllocations(chainIds, accountId)
      setHasAllocations(allocations && allocations.length > 0)

      const baseParams = {
        chainIds,
        filters: [
          getFilterTerm(
            'nftAddress',
            allocations.map((x) => x.nftAddress)
          )
        ],
        ignorePurgatory: true
      } as BaseQueryParams
      setQueryAssetsAllocation(generateBaseQuery(baseParams))
    }
    init()
  }, [accountId, chainIds])
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
  }, [chainIds])

  return (
    <>
      <section className={styles.section}>
        <h3>Bookmarks</h3>
        <Bookmarks />
      </section>

      {hasAllocations && (
        <SectionQueryResult
          title="Assets with allocations"
          query={queryAssetsAllocation}
        />
      )}
      <SectionQueryResult
        title="Highest veOCEAN Allocations"
        query={queryMostAllocation}
      />

      <SectionQueryResult title="Most Sales" query={queryMostSales} />

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
