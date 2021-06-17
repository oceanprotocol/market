import React, { ReactElement, useEffect, useState } from 'react'
import SearchBar from '../molecules/SearchBar'
import styles from './Home.module.css'
import AssetList from '../organisms/AssetList'
import {
  QueryResult,
  SearchQuery
} from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import Container from '../atoms/Container'
import Button from '../atoms/Button'
import Bookmarks from '../molecules/Bookmarks'
import axios from 'axios'
import { queryMetadata } from '../../utils/aquarius'
import Permission from '../organisms/Permission'
import { getHighestLiquidityDIDs } from '../../utils/subgraph'
import { DDO, Logger } from '@oceanprotocol/lib'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { useUserPreferences } from '../../providers/UserPreferences'

async function getQueryHighest(
  chainIds: number[]
): Promise<[SearchQuery, string]> {
  const dids = await getHighestLiquidityDIDs()

  // TODO: this query needs to adapt to chainIds
  const queryHighest = {
    page: 1,
    offset: 15,
    query: {
      query_string: {
        query: `(${dids}) AND -isInPurgatory:true`,
        fields: ['dataToken']
      }
    }
  }

  return [queryHighest, dids]
}

function getQueryLatest(chainIds: number[]): SearchQuery {
  // TODO: this query needs to adapt to chainIds
  return {
    page: 1,
    offset: 9,
    query: {
      query_string: {
        query: `-isInPurgatory:true`
      }
    },
    sort: { created: -1 }
  }
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
  const { appConfig } = useSiteMetadata()
  const [result, setResult] = useState<QueryResult>()
  const [loading, setLoading] = useState<boolean>()

  useEffect(() => {
    if (!appConfig.metadataCacheUri) return
    const source = axios.CancelToken.source()

    async function init() {
      try {
        setLoading(true)
        const result = await queryMetadata(
          query,
          appConfig.metadataCacheUri,
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
  }, [appConfig.metadataCacheUri, query, queryData])

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
  const [queryAndDids, setQueryAndDids] = useState<[SearchQuery, string]>()
  const { chainIds } = useUserPreferences()

  useEffect(() => {
    getQueryHighest(chainIds).then((results) => {
      setQueryAndDids(results)
    })
  }, [chainIds])

  return (
    <Permission eventType="browse">
      <>
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
          query={getQueryLatest(chainIds)}
          action={
            <Button style="text" to="/search?sort=created&sortOrder=desc">
              All data sets and algorithms →
            </Button>
          }
        />
      </>
    </Permission>
  )
}
