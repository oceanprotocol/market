import React, { ReactElement, useEffect, useState } from 'react'
import SearchBar from '../molecules/SearchBar'
import { ServiceMetaDataMarket } from '../../@types/MetaData'
import AssetTeaser from '../molecules/AssetTeaser'
import styles from './Home.module.css'
import axios from 'axios'
import { oceanConfig } from '../../../app.config'
import { DDO } from '@oceanprotocol/lib'

export default function HomePage(): ReactElement {
  const [assets, setAssets] = useState<DDO[]>()

  useEffect(() => {
    async function getAllAssets() {
      try {
        const result = await axios(
          `${oceanConfig.metadataStoreUri}/api/v1/aquarius/assets/ddo`
        )
        setAssets(result.data)
      } catch (error) {
        console.error(error.message)
      }
    }
    getAllAssets()
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
