import React, { ReactElement, useState, useEffect } from 'react'
import { QueryResult } from '@oceanprotocol/squid/dist/node/aquarius/Aquarius'
import SearchBar from '../../molecules/SearchBar'
import AssetList from '../../organisms/AssetList'
import { SearchPriceFilter } from '../../molecules/SearchPriceFilter'

import styles from './index.module.css'
import queryString from 'query-string'
import { getResults } from './utils'

export declare type SearchPageProps = {
  text: string | string[]
  tag: string | string[]
  queryResult: QueryResult
}

export default function SearchPage({
  location
}: {
  location: Location
}): ReactElement {
  const parsed = queryString.parse(location.search)
  const { text, tag } = parsed
  const [queryResult, setQueryResult] = useState<QueryResult>()

  useEffect(() => {
    async function initSearch() {
      const results = await getResults(parsed)
      setQueryResult(results)
    }
    initSearch()
  }, [])

  return (
    <section className={styles.grid}>
      <div className={styles.search}>
        {text && <SearchBar initialValue={text as string} />}
      </div>

      <aside className={styles.side}>
        <SearchPriceFilter />
      </aside>

      <div className={styles.results}>
        {queryResult && queryResult.results.length > 0 ? (
          <AssetList queryResult={queryResult} />
        ) : (
          <div className={styles.empty}>No results found.</div>
        )}
      </div>
    </section>
  )
}
