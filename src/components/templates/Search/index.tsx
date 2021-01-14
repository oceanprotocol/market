import React, { ReactElement, useState, useEffect } from 'react'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import SearchBar from '../../molecules/SearchBar'
import AssetQueryList from '../../organisms/AssetQueryList'
import styles from './index.module.css'
import queryString from 'query-string'
import PriceFilter from './filterPrice'
import Sort from './sort'
import { getResults } from './utils'
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
  const { text, owner, tags, page, sort, sortOrder, price } = parsed
  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [loading, setLoading] = useState<boolean>()
  const [priceType, setPriceType] = useState<string>(price as string)
  const [sortType, setSortType] = useState<string>(sort as string)

  useEffect(() => {
    if (!config?.metadataCacheUri) return

    async function initSearch() {
      parsed.priceType = priceType
      parsed.sort = sortType
      setLoading(true)
      setTotalResults(undefined)
      const queryResult = await getResults(parsed, config.metadataCacheUri)
      setQueryResult(queryResult)
      setTotalResults(queryResult.totalResults)
      setLoading(false)
    }
    initSearch()
  }, [text, owner, tags, page, sortType, priceType, config.metadataCacheUri])

  return (
    <section className={styles.grid}>
      <div className={styles.search}>
        {(text || owner) && (
          <SearchBar initialValue={(text || owner) as string} />
        )}
        <div className={styles.row}>
          <PriceFilter priceType={priceType} setPriceType={setPriceType} />
          <Sort sortType={sortType} setSortType={setSortType} />
        </div>
      </div>
      <div className={styles.results}>
        {loading ? <Loader /> : <AssetQueryList queryResult={queryResult} />}
      </div>
    </section>
  )
}
