import React, { ReactElement, useState, useEffect } from 'react'
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

export default function SearchPage({
  location,
  setTotalResults,
  setTotalPagesNumber
}: {
  location: Location
  setTotalResults: (totalResults: number) => void
  setTotalPagesNumber: (totalPagesNumber: number) => void
}): ReactElement {
  const parsed = queryString.parse(location.search)
  const { text, owner, tags, page, sort, sortOrder, serviceType, accessType } =
    parsed
  const { chainIds } = useUserPreferences()
  const [queryResult, setQueryResult] = useState<any>()
  const [loading, setLoading] = useState<boolean>()
  const [service, setServiceType] = useState<string>(serviceType as string)
  const [access, setAccessType] = useState<string>(accessType as string)
  const [sortType, setSortType] = useState<string>(sort as string)
  const [sortDirection, setSortDirection] = useState<string>(
    sortOrder as string
  )
  const newCancelToken = useCancelToken()

  useEffect(() => {
    async function initSearch() {
      setLoading(true)
      setTotalResults(undefined)
      const queryResult = await getResults(parsed, chainIds, newCancelToken())
      setQueryResult(queryResult)
      setTotalResults(queryResult.totalResults)
      setTotalPagesNumber(queryResult.totalPages)
      setLoading(false)
    }
    initSearch()
  }, [
    text,
    owner,
    tags,
    sort,
    page,
    serviceType,
    accessType,
    sortOrder,
    chainIds,
    newCancelToken
  ])

  function setPage(page: number) {
    const newUrl = updateQueryStringParameter(
      location.pathname + location.search,
      'page',
      `${page}`
    )
    return navigate(newUrl)
  }

  return (
    <Permission eventType="browse">
      <>
        <div className={styles.search}>
          <div className={styles.row}>
            <Filters
              serviceType={service}
              accessType={access}
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
            onPageChange={setPage}
          />
        </div>
      </>
    </Permission>
  )
}
