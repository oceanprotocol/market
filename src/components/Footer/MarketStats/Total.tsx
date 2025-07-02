import PriceUnit from '@shared/Price/PriceUnit'
import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { StatsTotal } from './_types'
import { getResults, updateQueryStringParameter } from '../../Search/utils'
import { useDebouncedCallback } from 'use-debounce'
import queryString from 'query-string'
import { useCancelToken } from '@hooks/useCancelToken'
import { useUserPreferences } from '@context/UserPreferences'
import { generateBaseQuery, queryStats } from '@utils/aquarius'

export default function MarketStatsTotal({
  total
}: {
  total: StatsTotal
}): ReactElement {
  const [parsed, setParsed] = useState<queryString.ParsedQuery<string>>()
  const { chainIds } = useUserPreferences()
  const [totalOrders, setTotalOrders] = useState<number>(0)
  const [totalAssets, setTotalAssets] = useState<number>(0)
  const [queryResult, setQueryResult] = useState<PagedAssets>()
  const [loading, setLoading] = useState<boolean>(true)
  const newCancelToken = useCancelToken()

  const baseQueryParams = {
    chainIds,
    query: {},
    esPaginationOptions: { from: 0, size: 0 }
  } as BaseQueryParams

  const fetchAssets = useDebouncedCallback(async () => {
    const query = generateBaseQuery(baseQueryParams)

    setLoading(true)
    const result = await queryStats(query, newCancelToken())
    setTotalOrders(result.totalOrders)
    setTotalAssets(result.pagedAssets.totalResults)
    setLoading(false)
  }, 500)

  useEffect(() => {
    if (!chainIds) return

    fetchAssets()
  }, [chainIds, fetchAssets])
  console.log('test')

  return (
    <>
      {loading ? (
        <span>Loading statistics...</span>
      ) : (
        <>
          <PriceUnit price={totalOrders || total.orders} size="small" /> orders
          across <PriceUnit price={totalAssets || total.nfts} size="small" />{' '}
          assets
          {/* with{' '}
          <PriceUnit
            price={queryResult?.totalResults || total.datatokens}
            size="small"
          />{' '}
          different datatokens. */}
          <div style={{ display: 'none' }}>
            Debug info:{' '}
            {JSON.stringify({
              queryResult,
              parsed,
              chainIds
            })}
          </div>
        </>
      )}
    </>
  )
}
