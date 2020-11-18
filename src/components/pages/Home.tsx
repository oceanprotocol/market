import React, { ReactElement, useEffect, useState } from 'react'
import SearchBar from '../molecules/SearchBar'
import styles from './Home.module.css'
import { MetadataCache, Logger, DDO } from '@oceanprotocol/lib'
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
import axios, { AxiosResponse, CancelToken } from 'axios'

const partnerAccounts = listPartners
  .map((partner) => partner.accounts.join(','))
  .filter((account) => account !== '')

const searchAccounts = JSON.stringify(partnerAccounts)
  .replace(/"/g, '')
  .replace(/,/g, ' OR ')
  .replace(/(\[|\])/g, '')

const queryPartners = {
  page: 1,
  offset: 100,
  query: {
    nativeSearch: 1,
    query_string: {
      query: `(publicKey.owner:${searchAccounts}) -isInPurgatory:true`
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

// TODO: import directly from ocean.js somehow.
// Transforming Aquarius' direct response is needed for getting actual DDOs
// and not just strings of DDOs. For now, taken from
// https://github.com/oceanprotocol/ocean.js/blob/main/src/metadatacache/MetadataCache.ts#L361-L375
function transformResult(
  {
    results,
    page,
    total_pages: totalPages,
    total_results: totalResults
  }: any = {
    result: [],
    page: 0,
    total_pages: 0,
    total_results: 0
  }
): QueryResult {
  return {
    results: (results || []).map((ddo: DDO) => new DDO(ddo as DDO)),
    page,
    totalPages,
    totalResults
  }
}

async function getAssets(
  query: SearchQuery,
  metadataCacheUri: string,
  cancelToken: CancelToken
) {
  try {
    const response: AxiosResponse<QueryResult> = await axios.post(
      `${metadataCacheUri}/api/v1/aquarius/assets/ddo/query`,
      { ...query, cancelToken }
    )
    if (!response || response.status !== 200 || !response.data) return

    return transformResult(response.data)
  } catch (error) {
    if (axios.isCancel(error)) {
      Logger.log(error.message)
    } else {
      Logger.error(error.message)
    }
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
    if (!config?.metadataCacheUri) return

    const source = axios.CancelToken.source()

    async function init() {
      // TODO: remove any once ocean.js has nativeSearch typings
      const queryResultHighest = await getAssets(
        queryHighest as any,
        config.metadataCacheUri,
        source.token
      )
      setQueryResultHighest(queryResultHighest)

      const queryResultPartners = await getAssets(
        queryPartners as any,
        config.metadataCacheUri,
        source.token
      )
      setQueryResultPartners(queryResultPartners)

      const queryResultLatest = await getAssets(
        queryLatest as any,
        config.metadataCacheUri,
        source.token
      )
      setQueryResultLatest(queryResultLatest)
      setLoading(false)
    }
    init()

    return () => {
      source.cancel()
    }
  }, [config?.metadataCacheUri])

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
