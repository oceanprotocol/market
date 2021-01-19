import React, { ReactElement, useState, useEffect } from 'react'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import SearchBar from '../../molecules/SearchBar'
import AssetQueryList from '../../organisms/AssetQueryList'
import styles from './index.module.css'
import queryString from 'query-string'
import { getResults } from './utils'
import Loader from '../../atoms/Loader'
import { useOcean } from '@oceanprotocol/react'
import { useStaticQuery, graphql } from 'gatsby'
import { EwaiInstanceQuery } from '../../../ewai/client/ewai-js'
import { ewaiCheckResultsForSpamAsync } from '../../../ewai/ewaifilter'

export default function SearchPage({
  location,
  setTotalResults
}: {
  location: Location
  setTotalResults: (totalResults: number) => void
}): ReactElement {
  const { config } = useOcean()
  const parsed = queryString.parse(location.search)
  const { text, owner, tags, page } = parsed
  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [loading, setLoading] = useState<boolean>()

  const data = useStaticQuery<EwaiInstanceQuery>(
    graphql`
      query EwaiInstanceSearch {
        ewai {
          ewaiInstance {
            name
          }
        }
      }
    `
  )

  useEffect(() => {
    if (!config?.metadataCacheUri) return

    async function initSearch() {
      setLoading(true)
      setTotalResults(undefined)
      const queryResult = await getResults(
        data.ewai.ewaiInstance.name,
        parsed,
        config.metadataCacheUri
      )
      let filteredResultsSet = false
      if (
        process.env.EWAI_CHECK_FOR_SPAM_ASSETS?.toLowerCase() === 'true' &&
        queryResult?.results.length > 0
      ) {
        const filteredResults = await ewaiCheckResultsForSpamAsync(queryResult)
        setQueryResult(filteredResults)
        setTotalResults(filteredResults.results.length)
        filteredResultsSet = true
      }
      if (!filteredResultsSet) {
        setQueryResult(queryResult)
        setTotalResults(queryResult.totalResults)
      }

      setLoading(false)
    }
    initSearch()
  }, [text, owner, tags, page, config.metadataCacheUri])

  return (
    <section className={styles.grid}>
      <div className={styles.search}>
        {(text || owner) && (
          <SearchBar initialValue={(text || owner) as string} />
        )}
      </div>
      <div className={styles.results}>
        {loading ? <Loader /> : <AssetQueryList queryResult={queryResult} />}
      </div>
    </section>
  )
}
