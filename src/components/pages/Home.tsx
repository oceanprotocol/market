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
import { queryMetadata } from '../../utils/aquarius'
import { rbacRequest } from '../../utils/rbac'

async function run() {
  const rbacResponse = await rbacRequest(
    'market',
    'consume',
    'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDWVdQTTJLY1NKUjJtV0o2ZFBqZTVKVmZ5YTZnZXdhVElVZDBabUoyWndFIn0.eyJleHAiOjE2MjE1MTE2MTgsImlhdCI6MTYyMTUxMTAxOCwianRpIjoiZWI3YzZjNmYtYjVjYi00YjA0LWI0ZjAtOWMzZTEzOGM3YWViIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay1pbnQuZGF0YS1tYXJrZXRwbGFjZS5pby9hdXRoL3JlYWxtcy9tYXJrZXRwbGFjZSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJkZDM2NDVlZi0zN2Q5LTQzMzQtOWEzYy1jMjczNTRkYmNkMWMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwb3J0YWwiLCJzZXNzaW9uX3N0YXRlIjoiMzU3NmIyNWUtYjNkNy00ZDkwLTgxNDAtYTE5MzQ3NjZmNTMyIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3BvcnRhbC1pbnQuZGF0YS1tYXJrZXRwbGFjZS5pbyJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJwdWJsaXNoZXIiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiamFtaWUgb2NlYW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqYW1pZUBvY2Vhbi5jb20iLCJnaXZlbl9uYW1lIjoiamFtaWUiLCJmYW1pbHlfbmFtZSI6Im9jZWFuIiwiZW1haWwiOiJqYW1pZUBvY2Vhbi5jb20ifQ.YAuPrGiJHDnziuNBR67NMPNcrffCyJeUDAFMI3ugy8_NsahM0V6HIAfZ3pjAbX94TP_L1NbCLlbqRdMcRviJxaM1ffWe6JZ_2ktr1kGPtUScen8YF3Gke_uFMDVlkg4fjZi50-DVUy9GmuKcdHEBoRxLC3j1RfOpXtfVq8LIuIG04bJD0JUTxwsoZhmNXvcyldjN2XDsDKXJ90aLzE3do9GaHajTERbAiOXDFjUSxk2B4lttZyU9ZIVVNEVCJ6J0NjW_H-y0Jdqk-MqdpIaWW0k3X_i7nlvVh4bt0aFcGpb6LIyphL5Ivl7hbggg3_zetYAsdwJFgL5f7ICG8heX0Q'
  )
  console.log('rbacResponse', rbacResponse)
}
run()

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
  action
}: {
  title: ReactElement | string
  query: SearchQuery
  action?: ReactElement
}) {
  const { config } = useOcean()
  const [result, setResult] = useState<QueryResult>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!config?.metadataCacheUri) return

    const source = axios.CancelToken.source()

    async function init() {
      const result = await queryMetadata(
        query,
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
