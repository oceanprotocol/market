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
import { useWeb3 } from '../../providers/Web3'

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
  const [loading, setLoading] = useState<boolean>()

  useEffect(() => {
    if (!config?.metadataCacheUri) return
    const source = axios.CancelToken.source()

    async function init() {
      try {
        setLoading(true)
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
        if (result.results.length === 0) return
        setResult(result)
        setLoading(false)
      } catch (error) {
        Logger.log(error.message)
      }
    }
    init()

    return () => {
      source.cancel()
    }
  }, [query, config?.metadataCacheUri])

  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      <AssetList
        assets={result?.results}
        showPagination={false}
        isLoading={loading}
      />
      {action && action}
    </section>
  )
}

export default function HomePage(): ReactElement {
  const { config, loading } = useOcean()
  const [queryAndDids, setQueryAndDids] = useState<[SearchQuery, string]>()
  const { web3Loading, web3Provider } = useWeb3()

  useEffect(() => {
    if (loading || (web3Loading && web3Provider)) return
    getHighestLiquidityDIDs().then((results) => {
      const queryHighest = {
        page: 1,
        offset: 15,
        query: {
          query_string: {
            query: `(${results}) AND -isInPurgatory:true`,
            fields: ['dataToken']
          }
        }
      }
      setQueryAndDids([queryHighest, results])
    })
  }, [config.subgraphUri, loading, web3Loading])

  return (
    <>
      <Container narrow className={styles.searchWrap}>
        <SearchBar size="large" />
      </Container>

      <section className={styles.section}>
        <h3>Bookmarks</h3>
        <Bookmarks />
      </section>

      {queryAndDids && (
        <SectionQueryResult
          title="Highest Liquidity"
          query={queryAndDids[0]}
          queryData={queryAndDids[1]}
        />
      )}

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
