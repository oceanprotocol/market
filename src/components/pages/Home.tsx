import React, { ReactElement, useEffect, useState } from 'react'
import SearchBar from '../molecules/SearchBar'
import { ServiceMetaDataMarket } from '../../@types/MetaData'
import AssetTeaser from '../molecules/AssetTeaser'
import styles from './Home.module.css'
import { oceanConfig } from '../../../app.config'
import { DDO, MetadataStore, Logger } from '@oceanprotocol/lib'

export default function HomePage(): ReactElement {
  const [assets, setAssets] = useState<DDO[]>()

  useEffect(() => {
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

        result && result.results && setAssets(result.results)
      } catch (error) {
        console.error(error.message)
      }
    }
    getLatestAssets()
  }, [])

  return (
    <>
      <SearchBar large />

      {assets && (
        <div className={styles.grid}>
          {assets.length ? (
            assets.map((ddo: DDO) => {
              const {
                attributes
              }: ServiceMetaDataMarket = ddo.findServiceByType('metadata')

              return (
                <AssetTeaser key={ddo.id} did={ddo.id} metadata={attributes} />
              )
            })
          ) : (
            <div className={styles.empty}>
              No data sets found in {oceanConfig.metadataStoreUri}
            </div>
          )}
        </div>
      )}
    </>
  )
}
