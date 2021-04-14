import React, { ReactElement, useEffect, useState } from 'react'
import SearchBar from '../molecules/SearchBar'
import styles from './Home.module.css'
import AssetList from '../organisms/AssetList'
import {
  QueryResult,
  SearchQuery
} from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import Container from '../atoms/Container'
import Loader from '../atoms/Loader'
import { useOcean } from '../../providers/Ocean'
import Button from '../atoms/Button'
import Bookmarks from '../molecules/Bookmarks'
import axios from 'axios'
import { queryMetadata, retrieveDDO } from '../../utils/aquarius'
import { gql, useQuery } from '@apollo/client'
import { DDO, DID } from '@oceanprotocol/lib'
import web3 from 'web3'

const getHighestLiquidityAssets = gql`
  query HighestLiquidiyAssets {
    pools(orderBy: consumePrice, orderDirection: desc, first: 10) {
      id
      consumePrice
      spotPrice
      tx
      symbol
      name
      datatokenAddress
    }
  }
`
interface GraphResult {
  results?: DDO[]
  page?: number
  totalPages?: number
  totalResults?: number
}

const queryHighest = {
  page: 1,
  offset: 9,
  query: {
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
    query_string: {
      query: `-isInPurgatory:true`
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
  const { data } = useQuery(getHighestLiquidityAssets)

  useEffect(() => {
    if (!config?.metadataCacheUri || !data) return
    const source = axios.CancelToken.source()

    async function init() {
      if (queryType && queryType === 'graph') {
        const ddoList: DDO[] = []

        console.log('IS GRAPH')
        data.pools.forEach(async (pool: { datatokenAddress: string }) => {
          const did = web3.utils
            .toChecksumAddress(pool.datatokenAddress)
            .replace('0x', 'did:op:')
          const ddo = await retrieveDDO(
            did,
            config?.metadataCacheUri,
            source.token
          )
          if (ddo !== undefined) {
            ddoList.push(ddo)
          }
        })
        console.log('DDO LIST', ddoList)
        const result: QueryResult = { results: ddoList }
        console.log('RESULTS: ', result.results)
        setResult(result)
      } else {
        console.log('NOT GRAPH')
        const result = await queryMetadata(
          query,
          config.metadataCacheUri,
          source.token
        )
        setResult(result)
      }
      console.log('FINAL RESULT: ', result)
      setLoading(false)
    }
    init()

    return () => {
      source.cancel()
    }
  }, [config?.metadataCacheUri, data])

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

      <SectionQueryResult title="Highest Liquidity" queryType="graph" />

      <SectionQueryResult
        title="Recently Published"
        query={queryLatest}
        action={
          <Button style="text" to="/search?sort=created&sortOrder=desc">
            All data sets →
          </Button>
        }
      />
    </>
  )
}
