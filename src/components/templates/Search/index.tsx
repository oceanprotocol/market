import React, { ReactElement, useState, useEffect } from 'react'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import SearchBar from '../../molecules/SearchBar'
import AssetQueryList from '../../organisms/AssetQueryList'
import styles from './index.module.css'
import queryString from 'query-string'
import PriceFilter from './filterPrice'
import Sort from './sort'
import { getResults, addExistingParamsToUrl } from './utils'
import Loader from '../../atoms/Loader'
import { useOcean } from '@oceanprotocol/react'

export default function SearchPage({
  location,
  setTotalResults
}: {
  location: Location
  setTotalResults: (totalResults: number) => void
}): ReactElement {
  const { config } = useOcean()
  const parsed = queryString.parse(location.search)
  const { text, owner, tags, page, sort, sortOrder, priceType } = parsed
  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [loading, setLoading] = useState<boolean>()
  const [price, setPriceType] = useState<string>(priceType as string)
  const [sortType, setSortType] = useState<string>(sort as string)
  const [sortDirection, setSortDirection] = useState<string>(
    sortOrder as string
  )

  useEffect(() => {
    if (!config?.metadataCacheUri) return

    async function initSearch() {
      setLoading(true)
      setTotalResults(undefined)
      const queryResult = await getResults(parsed, config.metadataCacheUri)
      setQueryResult(queryResult)
      setTotalResults(queryResult.totalResults)
      setLoading(false)
    }
    initSearch()
  }, [
    text,
    owner,
    tags,
    page,
    sort,
    priceType,
    sortOrder,
    config.metadataCacheUri
  ])

  return (
    <section className={styles.grid}>
      <div className={styles.search}>
        {(text || owner) && (
          <SearchBar initialValue={(text || owner) as string} />
        )}
        <div className={styles.row}>
          <PriceFilter priceType={price} setPriceType={setPriceType} />
          <Sort
            sortType={sortType}
            sortDirection={sortDirection}
            setSortType={setSortType}
            setSortDirection={setSortDirection}
            setPriceType={setPriceType}
          />
        </div>
      </div>
      <div className={styles.results}>
        {loading ? <Loader /> : <AssetQueryList queryResult={queryResult} />}
      </div>
    </section>
  )
}
