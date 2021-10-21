import React, { ReactElement, useState, useEffect, useCallback } from 'react'
import Permission from '../../organisms/Permission'
import AssetList from '../../organisms/AssetList'
import queryString from 'query-string'
import Filters from './Filters'
import Sort from './sort'
import { getResults } from './utils'
import { navigate } from 'gatsby'
import { updateQueryStringParameter } from '../../../utils'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { useCancelToken } from '../../../hooks/useCancelToken'
import styles from './index.module.css'
import { PagedAssets } from '../../../models/PagedAssets'

export default function SearchPage({
  location,
  setTotalResults,
  setTotalPagesNumber
}: {
  location: Location
  setTotalResults: (totalResults: number) => void
  setTotalPagesNumber: (totalPagesNumber: number) => void
}): ReactElement {
  const [parsed, setParsed] = useState<queryString.ParsedQuery<string>>()
  const { chainIds } = useUserPreferences()
  const [queryResult, setQueryResult] = useState<PagedAssets>()
  const [loading, setLoading] = useState<boolean>()
  const [serviceType, setServiceType] = useState<string>()
  const [accessType, setAccessType] = useState<string>()
  const [sortType, setSortType] = useState<string>()
  const [sortDirection, setSortDirection] = useState<string>()
  const newCancelToken = useCancelToken()

  useEffect(() => {
    const parsed = queryString.parse(location.search)
    const { sort, sortOrder, serviceType, accessType } = parsed
    setParsed(parsed)
    setServiceType(serviceType as string)
    setAccessType(accessType as string)
    setSortDirection(sortOrder as string)
    setSortType(sort as string)
  }, [location])

  const updatePage = useCallback(
    (page: number) => {
      const { pathname, search } = location
      const newUrl = updateQueryStringParameter(
        pathname + search,
        'page',
        `${page}`
      )
      return navigate(newUrl)
    },
    [location]
  )

  const fetchAssets = useCallback(
    async (parsed: queryString.ParsedQuery<string>, chainIds: number[]) => {
      setLoading(true)
      setTotalResults(undefined)
      const queryResult = await getResults(parsed, chainIds, newCancelToken())
      setQueryResult(queryResult)
      setTotalResults(queryResult.totalResults)
      setTotalPagesNumber(queryResult.totalPages)
      setLoading(false)
    },
    [newCancelToken, setTotalPagesNumber, setTotalResults]
  )
  useEffect(() => {
    if (!parsed || !queryResult) return
    const { page } = parsed
    if (queryResult.totalPages < Number(page)) updatePage(1)
  }, [parsed, queryResult, updatePage])

  useEffect(() => {
    if (!parsed || !chainIds) return
    fetchAssets(parsed, chainIds)
  }, [parsed, chainIds, newCancelToken, fetchAssets])

  return (
    <Permission eventType="browse">
      <>
        <div className={styles.search}>
          <div className={styles.row}>
            <Filters
              serviceType={serviceType}
              accessType={accessType}
              setServiceType={setServiceType}
              setAccessType={setAccessType}
              addFiltersToUrl
            />
            <Sort
              sortType={sortType}
              sortDirection={sortDirection}
              setSortType={setSortType}
              setSortDirection={setSortDirection}
            />
          </div>
        </div>
        <div className={styles.results}>
          <AssetList
            assets={queryResult?.results}
            showPagination
            isLoading={loading}
            page={queryResult?.page}
            totalPages={queryResult?.totalPages}
            onPageChange={updatePage}
          />
        </div>
      </>
    </Permission>
  )
}
