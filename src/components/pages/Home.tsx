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
import listPartners from '@oceanprotocol/list-datapartners'
import Tooltip from '../atoms/Tooltip'
import AssetQueryCarousel from '../organisms/AssetQueryCarousel'

const partnerAccounts = listPartners.map((partner) =>
  partner.accounts.join(',')
)

const queryPartners = {
  page: 1,
  offset: 100,
  query: {
    nativeSearch: 1,
    query_string: {
      query: `(publicKey.owner:${partnerAccounts}) -isInPurgatory:true`
    }
  },
  sort: { created: -1 }
}

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

async function getAssets(query: SearchQuery, metadataCacheUri: string) {
  try {
    const metadataCache = new MetadataCache(metadataCacheUri, Logger)
    const result = await metadataCache.queryMetadata(query)
    return result
  } catch (error) {
    Logger.error(error.message)
  }
}

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

function SectionQuery({
  title,
  result,
  loading,
  action
}: {
  title: ReactElement | string
  result: QueryResult
  loading: boolean
  action?: ReactElement
}) {
  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      {loading ? (
        <LoaderArea />
      ) : (
        result && <AssetQueryList queryResult={result} />
      )}
      {action && action}
    </section>
  )
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

      <section className={styles.listPartners}>
        <h3>
          Data Partners{' '}
          <Tooltip
            content={
              <>
                Ocean Protocol{' '}
                <a href="https://github.com/oceanprotocol/list-datapartners">
                  Data Partners
                </a>
              </>
            }
          />
        </h3>
        {loading ? (
          <LoaderArea />
        ) : (
          queryResultPartners && (
            <AssetQueryCarousel queryResult={queryResultPartners} />
          )
        )}
        {/* <Button
          style="text"
          to={`/search/?owner=${partnerAccounts?.toString()}`}
        >
          All data partner sets →
        </Button> */}
      </section>

      <section className={styles.section}>
        <h3>Bookmarks</h3>
        <Bookmarks />
      </section>

      <SectionQuery
        title="Highest Liquidity Pools"
        loading={loading}
        result={queryResultHighest}
      />

      <SectionQuery
        title="New Data Sets"
        loading={loading}
        result={queryResultLatest}
        action={
          <Button style="text" to="/search">
            All data sets →
          </Button>
        }
      />
    </>
  )
}
