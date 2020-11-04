import React, { ReactElement, useEffect, useState } from 'react'
import SearchBar from '../molecules/SearchBar'
import styles from './Home.module.css'
import { MetadataCache, Logger } from '@oceanprotocol/lib'
import AssetQueryList from '../organisms/AssetQueryList'
import {
  QueryResult,
  SearchQuery
} from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import Container from '../atoms/Container'
import Loader from '../atoms/Loader'
import { useOcean } from '@oceanprotocol/react'
import Button from '../atoms/Button'
import Bookmarks from '../molecules/Bookmarks'
import listPartners from '../../../content/list-datapartners.json'
import Tooltip from '../atoms/Tooltip'

const partnerAccounts = listPartners.map((partner) =>
  partner.accounts.join(',')
)

const queryHighest = {
  page: 1,
  offset: 9,
  query: { 'price.type': ['pool'] },
  sort: { 'price.ocean': -1 }
}

const queryPartners = {
  page: 1,
  offset: 9,
  query: { 'publicKey.owner': partnerAccounts },
  sort: { created: -1 }
}

const queryLatest = {
  page: 1,
  offset: 9,
  query: {},
  sort: { created: -1 }
}

async function getAssets(query: SearchQuery, metadataCacheUri: string) {
  try {
    const metadataCache = new MetadataCache(metadataCacheUri, Logger)
    const result = await metadataCache.queryMetadata(query)

    return result
  } catch (error) {
    Logger.error(error.message)
  }
}

export default function HomePage(): ReactElement {
  const { config } = useOcean()

  const [queryResultLatest, setQueryResultLatest] = useState<QueryResult>()
  const [queryResultPartners, setQueryResultPartners] = useState<QueryResult>()
  const [queryResultHighest, setQueryResultHighest] = useState<QueryResult>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const queryResultHighest = await getAssets(
        queryHighest,
        config.metadataCacheUri
      )
      setQueryResultHighest(queryResultHighest)

      const queryResultPartners = await getAssets(
        queryPartners,
        config.metadataCacheUri
      )
      setQueryResultPartners(queryResultPartners)

      const queryResultLatest = await getAssets(
        queryLatest,
        config.metadataCacheUri
      )
      setQueryResultLatest(queryResultLatest)
      setLoading(false)
    }
    init()
  }, [config.metadataCacheUri])

  return (
    <>
      <Container narrow className={styles.searchWrap}>
        <SearchBar size="large" />
      </Container>

      <section className={styles.latest}>
        <h3>Bookmarks</h3>
        <Bookmarks />
      </section>

      <section className={styles.latest}>
        <h3>
          Data Partners{' '}
          <Tooltip
            content={
              <>
                Learn more about{' '}
                <a href="https://blog.oceanprotocol.com/announcing-ocean-market-data-launch-partners-3b531601e63a">
                  our data partners
                </a>
              </>
            }
          />
        </h3>
        {loading ? (
          <Loader />
        ) : (
          queryResultPartners && (
            <AssetQueryList
              queryResult={queryResultPartners}
              overflow
              className={styles.listPartners}
            />
          )
        )}
      </section>

      <section className={styles.latest}>
        <h3>Highest Liquidity Pools</h3>
        {loading ? (
          <Loader />
        ) : (
          queryResultHighest && (
            <AssetQueryList queryResult={queryResultHighest} />
          )
        )}
      </section>

      <section className={styles.latest}>
        <h3>New Data Sets</h3>
        {loading ? (
          <Loader />
        ) : (
          queryResultLatest && (
            <AssetQueryList queryResult={queryResultLatest} />
          )
        )}
        {queryResultLatest?.results.length === 9 && (
          <Button style="text" to="/search">
            All data sets →
          </Button>
        )}
      </section>
    </>
  )
}
