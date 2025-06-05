import PriceUnit from '@shared/Price/PriceUnit'
import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { StatsTotal } from './_types'
import { getResults, updateQueryStringParameter } from '../../Search/utils'
import { useDebouncedCallback } from 'use-debounce'
import queryString from 'query-string'
import { useCancelToken } from '@hooks/useCancelToken'
import { useUserPreferences } from '@context/UserPreferences'

export default function MarketStatsTotal({
  total
}: {
  total: StatsTotal
}): ReactElement {
  const router = useRouter()
  const [parsed, setParsed] = useState<queryString.ParsedQuery<string>>()
  const { chainIds } = useUserPreferences()
  const [queryResult, setQueryResult] = useState<PagedAssets>()
  const [loading, setLoading] = useState<boolean>(true)
  const newCancelToken = useCancelToken()
  const isSearchPage = true

  useEffect(() => {
    const parsed = queryString.parse(location.search, {
      arrayFormat: 'separator'
    })
    setParsed(parsed)
  }, [router])

  const updatePage = useCallback(
    (page: number) => {
      const { pathname, query } = router
      const newUrl = updateQueryStringParameter(
        pathname +
          '?' +
          JSON.stringify(query)
            .replace(/"|{|}/g, '')
            .replace(/:/g, '=')
            .replace(/,/g, '&'),
        'page',
        `${page}`
      )
      return router.push(newUrl)
    },
    [router]
  )

  const fetchAssets = useDebouncedCallback(
    async (parsed: queryString.ParsedQuery<string>, chainIds: number[]) => {
      setLoading(true)
      // setTotalResults(undefined)
      const queryResult = await getResults(parsed, chainIds, newCancelToken())
      setQueryResult(queryResult)
      console.log('Total assets found:', queryResult)

      // setTotalResults(queryResult?.totalResults || 0)
      console.log('Number of assets', queryResult?.totalResults)
      // setTotalPagesNumber(queryResult?.totalPages || 0)
      setLoading(false)
    },
    500
  )
  useEffect(() => {
    if (!parsed || !queryResult) return
    const { page } = parsed
    if (queryResult.totalPages < Number(page)) updatePage(1)
  }, [parsed, queryResult, updatePage])

  useEffect(() => {
    if (!parsed || !chainIds) return

    fetchAssets(parsed, chainIds)
  }, [parsed, chainIds, fetchAssets])

  return (
    <>
      {loading ? (
        <span>Loading statistics...</span>
      ) : (
        <>
          <PriceUnit
            price={queryResult?.totalResults || total.orders}
            size="small"
          />{' '}
          orders across{' '}
          <PriceUnit
            price={queryResult?.totalResults || total.nfts}
            size="small"
          />{' '}
          assets with{' '}
          <PriceUnit
            price={queryResult?.totalResults || total.datatokens}
            size="small"
          />{' '}
          different datatokens.
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
