import React, { ReactElement, useEffect, useState } from 'react'
import SearchBar from '../molecules/SearchBar'
import styles from './Home.module.css'
import { MetadataStore, Logger } from '@oceanprotocol/lib'
import AssetList from '../organisms/AssetList'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatastore/MetadataStore'
import Container from '../atoms/Container'
import Loader from '../atoms/Loader'
import { getOceanConfig } from '../../utils/getConfig'

async function getLatestAssets() {
  try {
    const { metadataStoreUri } = getOceanConfig()
    const metadataStore = new MetadataStore(metadataStoreUri, Logger)

    const result = await metadataStore.queryMetadata({
      page: 1,
      offset: 10,
      query: {},
      sort: { created: -1 }
    })

    return result
  } catch (error) {
    console.error(error.message)
  }
}

export default function HomePage(): ReactElement {
  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const results = await getLatestAssets()
      setQueryResult(results)
      setLoading(false)
    }
    init()
  }, [])

  return (
    <>
      <Container narrow className={styles.searchWrap}>
        <SearchBar large />
      </Container>

      <section className={styles.latest}>
        <h3>Latest Data Sets</h3>
        {loading ? (
          <Loader />
        ) : (
          queryResult && <AssetList queryResult={queryResult} />
        )}
      </section>
    </>
  )
}
