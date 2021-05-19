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
import { getHighestLiquidityDIDs } from '../../utils/subgraph'
import { Logger } from '@oceanprotocol/lib'

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
  action
}: {
  title: ReactElement | string
  query: SearchQuery
  action?: ReactElement
}) {
  const { config } = useOcean()
  const [result, setResult] = useState<QueryResult>()

  useEffect(() => {
    if (!config?.metadataCacheUri) return
    const source = axios.CancelToken.source()

    async function init() {
      try {
        const result = await queryMetadata(
          query,
          config.metadataCacheUri,
          source.token
        )
        setResult(result)
      } catch (error) {
        Logger.log(error.message)
      }
    }
    init()

    return () => {
      source.cancel()
    }
  }, [config?.metadataCacheUri, query])

  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      <AssetList assets={result?.results} showPagination={false} />
      {action && action}
    </section>
  )
}

export default function HomePage(): ReactElement {
  const [searchDids, setSearchDIDs] = useState<string>()

  useEffect(() => {
    getHighestLiquidityDIDs().then((results) => {
      setSearchDIDs(results)
    })
  })
  const queryHighest = {
    page: 1,
    offset: 9,
    query: {
      query_string: {
        query: searchDids,
        fields: ['dataToken'],
        default_operator: 'OR'
      }
    }
  }

  return (
    <>
      <Container narrow className={styles.searchWrap}>
        <SearchBar size="large" />
      </Container>

      <section className={styles.section}>
        <h3>Bookmarks</h3>
        <Bookmarks />
      </section>

      <SectionQueryResult title="Highest Liquidity" query={queryHighest} />

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
