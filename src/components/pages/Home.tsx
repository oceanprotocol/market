import React, { ReactElement, useEffect, useState } from 'react'
import SearchBar from '../molecules/SearchBar'
import styles from './Home.module.css'
import AssetList from '../organisms/AssetList'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import Container from '../atoms/Container'
import Loader from '../atoms/Loader'
import { useOcean } from '@oceanprotocol/react'
import Button from '../atoms/Button'
import Bookmarks from '../molecules/Bookmarks'
import axios from 'axios'
import { queryMetadata } from '../../utils/aquarius'

const queryHighest = {
  page: 1,
  offset: 9,
  query: {
    nativeSearch: 1,
    query_string: {
      query: `(price.type:pool) -isInPurgatory:true`
    }
  },
  sort: { 'price.ocean': -1 }
}

const queryLatest = {
  page: 1,
  offset: 9,
  query: {
    nativeSearch: 1,
    query_string: {
      query: `-isInPurgatory:true`
    }
  },
  sort: { created: -1 }
}

const queryAlgorithms = {
  page: 1,
  offset: 9,
  query: {
    nativeSearch: 1,
    query_string: {
      query: `service.main.type == algorithm`
    }
  },
  sort: { created: -1 }
}

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

function SectionQueryResult({
  title,
  query,
  action
}: {
  title: ReactElement | string
  query: any
  action?: ReactElement
}) {
  const { config } = useOcean()
  const [result, setResult] = useState<QueryResult>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!config?.metadataCacheUri) return

    const source = axios.CancelToken.source()

    async function init() {
      // TODO: remove any once ocean.js has nativeSearch typings
      const result = await queryMetadata(
        query as any,
        config.metadataCacheUri,
        source.token
      )
      setResult(result)
      setLoading(false)
    }
    init()

    return () => {
      source.cancel()
    }
  }, [config?.metadataCacheUri, query])

  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      {loading ? (
        <LoaderArea />
      ) : (
        result && <AssetList assets={result.results} showPagination={false} />
      )}
      {action && action}
    </section>
  )
}

export default function HomePage(): ReactElement {
  return (
    <>
      <Container narrow className={styles.searchWrap}>
        <SearchBar size="large" />
      </Container>

      <section className={styles.section}>
        <h3>Bookmarks</h3>
        <Bookmarks />
      </section>

      <SectionQueryResult
        title="Highest Liquidity Pools"
        query={queryHighest}
      />

      <SectionQueryResult
        title="New Data Sets"
        query={queryLatest}
        action={
          <Button style="text" to="/search?sort=created&sortOrder=desc">
            All data sets →
          </Button>
        }
      />

      <SectionQueryResult
        title="New Algorithms"
        query={queryAlgorithms}
        action={
          <Button style="text" to="/search?sort=created&">
            All algorithms →
          </Button>
        }
      />
    </>
  )
}
