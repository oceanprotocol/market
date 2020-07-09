import React, { ReactElement } from 'react'
import SearchBar from '../molecules/SearchBar'
import shortid from 'shortid'
import { OceanAsset } from '../../@types/MetaData'
import AssetTeaser from '../molecules/AssetTeaser'
import styles from './Home.module.css'

export default function HomePage({
  assets
}: {
  assets: {
    node: OceanAsset
  }[]
}): ReactElement {
  return (
    <>
      <SearchBar large />
      {assets && (
        <div className={styles.grid}>
          {assets.map(({ node }: { node: OceanAsset }) => (
            <AssetTeaser
              key={shortid.generate()}
              did={node.did}
              metadata={node}
            />
          ))}
        </div>
      )}
    </>
  )
}
