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

function sortElements(items: DDO[], sorted: string[]) {
  items.sort(function (a, b) {
    return sorted.indexOf(a.dataToken) - sorted.indexOf(b.dataToken)
  })
  return items
}

function SectionQueryResult({
  title,
  query,
  action,
  queryData
}: {
  title: ReactElement | string
  query: SearchQuery
  action?: ReactElement
  queryData?: string
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
        if (result.totalResults <= 15) {
          const searchDIDs = queryData.split(' ')
          const sortedAssets = sortElements(result.results, searchDIDs)
          // We take more assets than we need from the subgraph (to make sure
          // all the 9 assets with highest liquidity we need are in OceanDB)
          // so we need to get rid of the surplus
          const overflow = sortedAssets.length - 9
          sortedAssets.splice(sortedAssets.length - overflow, overflow)
          result.results = sortedAssets
        }
        setResult(result)
      } catch (error) {
        Logger.log(error.message)
      }
    }
    init()

    return () => {
      source.cancel()
    }
  }, [config?.metadataCacheUri, query, queryData])

  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      <AssetList assets={result?.results} showPagination={false} />
      {action && action}
    </section>
  )
}

export default function HomePage(): ReactElement {
  const { config } = useOcean()
  const [queryHighestAssets, setQueryHighestAssets] = useState<SearchQuery>()
  const [searchDIDs, setSearchDIDs] = useState<string>()

  useEffect(() => {
    getHighestLiquidityDIDs().then((results) => {
      setSearchDIDs(results)
      const queryHighest = {
        page: 1,
        offset: 15,
        query: {
          query_string: {
            query: `(${searchDIDs}) AND -isInPurgatory:true AND price.isConsumable:true`,
            fields: ['dataToken']
          }
        }
      }
      setQueryHighestAssets(queryHighest)
    })
  }, [config.subgraphUri, searchDIDs, queryHighestAssets])

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
        title="Highest Liquidity"
        query={queryHighestAssets}
        queryData={searchDIDs}
      />

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
