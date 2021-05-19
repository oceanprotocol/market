import React, { ReactElement, useEffect, useState } from 'react'
import Button from '../atoms/Button'
import Container from '../atoms/Container'
import SearchBar from '../molecules/SearchBar'
import Bookmarks from '../molecules/Bookmarks'
import AssetList from '../organisms/AssetList'
import {
  QueryResult,
  SearchQuery
} from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { useOcean } from '../../providers/Ocean'
import axios from 'axios'
import { queryMetadata } from '../../utils/aquarius'
import { useWeb3 } from '../../providers/Web3'
import { section, searchWrap } from './Home.module.css'

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
  const { web3Loading } = useWeb3()

  useEffect(() => {
    if (!config?.metadataCacheUri || web3Loading) return
    const source = axios.CancelToken.source()

    async function init() {
      const result = await queryMetadata(
        query,
        config.metadataCacheUri,
        source.token
      )
      setResult(result)
    }
    init()

    return () => {
      source.cancel()
    }
  }, [config?.metadataCacheUri, query, web3Loading])

  return (
    <section className={section}>
      <h3>{title}</h3>
      <AssetList assets={result?.results} showPagination={false} />
      {action && action}
    </section>
  )
}

export default function HomePage(): ReactElement {
  return (
    <>
      <Container narrow className={searchWrap}>
        <SearchBar size="large" />
      </Container>

      <section className={section}>
        <h3>Bookmarks</h3>
        <Bookmarks />
      </section>

      <SectionQueryResult
        title="Highest Liquidity"
        query={queryHighest}
        action={
          <Button
            style="text"
            to="/search?priceType=pool&sort=liquidity&sortOrder=desc"
          >
            Data sets and algorithms with pool →
          </Button>
        }
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
