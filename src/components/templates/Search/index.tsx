import React, { ReactElement, useState, useEffect } from 'react'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import SearchBar from '../../molecules/SearchBar'
import AssetQueryList from '../../organisms/AssetQueryList'
import styles from './index.module.css'
import queryString from 'query-string'
import { getResults } from './utils'
import Loader from '../../atoms/Loader'
import { useOcean } from '@oceanprotocol/react'

export default function SearchPage({
  location
}: {
  location: Location
}): ReactElement {
  const { config } = useOcean()
  const parsed = queryString.parse(location.search)
  const { text, owner, tags, page } = parsed
  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [loading, setLoading] = useState<boolean>()

  useEffect(() => {
    async function initSearch() {
      setLoading(true)
      const queryResult = await getResults(parsed, config.metadataCacheUri)
      setQueryResult(queryResult)
      setLoading(false)
    }
    initSearch()
  }, [text, owner, tags, page, config.metadataCacheUri])

  return (
    <section className={styles.grid}>
      <div className={styles.search}>
        {text && <SearchBar initialValue={text as string} />}
      </div>

      <div className={styles.results}>
        {loading ? <Loader /> : <AssetQueryList queryResult={queryResult} />}
      </div>
    </section>
  )
}
