import React, { ReactElement, useEffect, useState } from 'react'
import SearchBar from '../molecules/SearchBar'
import styles from './Home.module.css'
import AssetList from '../organisms/AssetList'
import {
  QueryResult,
  SearchQuery
} from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import Container from '../atoms/Container'
import { useOcean } from '../../providers/Ocean'
import Button from '../atoms/Button'
import Bookmarks from '../molecules/Bookmarks'
import axios from 'axios'
import { queryMetadata } from '../../utils/aquarius'
import { getHighestLiquidityAssets } from '../../utils/subgraph'
import { DDO, Logger } from '@oceanprotocol/lib'

const queryLatest = {
  page: 1,
  offset: 9,
  query: {
    query_string: {
      query: `-isInPurgatory:true`
    }
  },
  sort: { created: -1 }
}

function SectionQueryResult({
  title,
  query,
  queryType,
  action
}: {
  title: ReactElement | string
  query?: SearchQuery
  queryType?: string
  action?: ReactElement
}) {
  const { config } = useOcean()
  const [result, setResult] = useState<QueryResult>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!config?.metadataCacheUri) return
    const source = axios.CancelToken.source()

    async function init() {
      setLoading(true)
      try {
        if (queryType && queryType === 'graph') {
          const ddoList: DDO[] = await getHighestLiquidityAssets(
            config.metadataCacheUri,
            source.token
          )
          const result: QueryResult = {
            results: ddoList,
            page: 1,
            totalPages: 1,
            totalResults: 9
          }
          setResult(result)
        } else {
          const result = await queryMetadata(
            query,
            config.metadataCacheUri,
            source.token
          )
          setResult(result)
        }
      } catch (error) {
        Logger.log(error.message)
      } finally {
        setLoading(false)
      }
    }
    init()

    return () => {
      source.cancel()
    }
  }, [config?.metadataCacheUri, queryType, query])

  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      <AssetList assets={result?.results} showPagination={false} />
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

      <SectionQueryResult title="Highest Liquidity" queryType="graph" />

      <SectionQueryResult
        title="Recently Published"
        query={queryLatest}
        action={
          <Button style="text" to="/search?sort=created&sortOrder=desc">
            All data sets and algorithms →
          </Button>
        }
      />
    </>
  )
}
