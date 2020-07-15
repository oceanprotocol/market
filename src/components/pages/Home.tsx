import React, { ReactElement, useEffect, useState } from 'react'
import SearchBar from '../molecules/SearchBar'
import { ServiceMetaDataMarket } from '../../@types/MetaData'
import AssetTeaser from '../molecules/AssetTeaser'
import styles from './Home.module.css'
import { oceanConfig } from '../../../app.config'
import { MetadataStore, Logger } from '@oceanprotocol/lib'
import AssetList from '../organisms/AssetList'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatastore/MetadataStore'

async function getLatestAssets() {
  try {
    const metadataStore = new MetadataStore(
      oceanConfig.metadataStoreUri,
      Logger
    )

    const result = await metadataStore.queryMetadata({
      page: 1,
      offset: 10,
      query: {},
      sort: { created: -1 }
    })

    return result
  } catch (error) {
    console.error(error.message)
  }
}

export default function HomePage(): ReactElement {
  const [queryResult, setQueryResult] = useState<QueryResult>()

  useEffect(() => {
    async function init() {
      const results = await getLatestAssets()
      setQueryResult(results)
    }
    init()
  }, [])

  return (
    <>
      <SearchBar large />
      <h3>Latest Data Sets</h3>
      {queryResult && <AssetList queryResult={queryResult} />}
    </>
  )
}
