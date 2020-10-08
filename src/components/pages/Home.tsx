import React, { ReactElement, useEffect, useState } from 'react'
import SearchBar from '../molecules/SearchBar'
import styles from './Home.module.css'
import { MetadataStore, Logger } from '@oceanprotocol/lib'
import AssetList from '../organisms/AssetList'
import {
  QueryResult,
  SearchQuery
} from '@oceanprotocol/lib/dist/node/metadatastore/MetadataStore'
import Container from '../atoms/Container'
import Loader from '../atoms/Loader'
import { useOcean } from '@oceanprotocol/react'

const queryHighest = {
  page: 1,
  offset: 3,
  query: { 'price.ocean': [0, 99999] },
  sort: { 'price.value': 1 }
}

const queryLatest = {
  page: 1,
  offset: 20,
  query: {},
  sort: { created: -1 }
}

async function getAssets(query: SearchQuery, metadataStoreUri: string) {
  try {
    const metadataStore = new MetadataStore(metadataStoreUri, Logger)
    const result = await metadataStore.queryMetadata(query)

    return result
  } catch (error) {
    Logger.error(error.message)
  }
}

export default function HomePage(): ReactElement {
  const { config } = useOcean()
  const [queryResultLatest, setQueryResultLatest] = useState<QueryResult>()
  const [queryResultHighest, setQueryResultHighest] = useState<QueryResult>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const queryResultHighest = await getAssets(
        queryHighest,
        config.metadataStoreUri
      )
      setQueryResultHighest(queryResultHighest)

      const queryResultLatest = await getAssets(
        queryLatest,
        config.metadataStoreUri
      )
      setQueryResultLatest(queryResultLatest)
      setLoading(false)
    }
    init()
  }, [config.metadataStoreUri])

  return (
    <>
      <Container narrow className={styles.searchWrap}>
        <SearchBar />
      </Container>

      <section className={styles.latest}>
        <h3>Highest Liquidity</h3>
        {loading ? (
          <Loader />
        ) : (
          queryResultHighest && <AssetList queryResult={queryResultHighest} />
        )}
      </section>

      <section className={styles.latest}>
        <h3>Latest</h3>
        {loading ? (
          <Loader />
        ) : (
          queryResultLatest && <AssetList queryResult={queryResultLatest} />
        )}
      </section>
    </>
  )
}
