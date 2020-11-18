import React, { ReactElement, useEffect, useState } from 'react'
import SearchBar from '../molecules/SearchBar'
import styles from './Home.module.css'
import AssetQueryList from '../organisms/AssetQueryList'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import Container from '../atoms/Container'
import Loader from '../atoms/Loader'
import { useOcean } from '@oceanprotocol/react'
import Button from '../atoms/Button'
import Bookmarks from '../molecules/Bookmarks'
import listPartners from '@oceanprotocol/list-datapartners'
import Tooltip from '../atoms/Tooltip'
import AssetQueryCarousel from '../organisms/AssetQueryCarousel'
import axios from 'axios'
import { queryMetadata } from '../../utils/aquarius'

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
        result && <AssetQueryList queryResult={result} />
      )}
      {action && action}
    </section>
  )
}

export default function HomePage(): ReactElement {
  const { config } = useOcean()

  const [queryResultPartners, setQueryResultPartners] = useState<QueryResult>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!config?.metadataCacheUri) return

    const source = axios.CancelToken.source()

    async function init() {
      // TODO: remove any once ocean.js has nativeSearch typings
      const queryResultPartners = await queryMetadata(
        queryPartners as any,
        config.metadataCacheUri,
        source.token
      )
      setQueryResultPartners(queryResultPartners)
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

      <SectionQueryResult
        title="Highest Liquidity Pools"
        query={queryHighest}
      />

      <SectionQueryResult
        title="New Data Sets"
        query={queryLatest}
        action={
          <Button style="text" to="/search">
            All data sets →
          </Button>
        }
      />
    </>
  )
}
