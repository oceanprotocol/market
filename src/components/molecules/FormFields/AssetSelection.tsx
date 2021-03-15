import React from 'react'
import slugify from 'slugify'
import styles from './AssetSelection.module.css'

export interface AssetSelectionAsset {
  did: string
  name: string
  price: string
}

export default function AssetSelection({
  assets,
  multiple,
  ...props
}: {
  assets: AssetSelectionAsset[]
  multiple?: boolean
}): JSX.Element {
  return (
    <div className={styles.selection}>
      <div className={styles.radioGroup}>
        {assets.map((asset: AssetSelectionAsset, index: number) => (
          <div className={styles.radioWrap} key={index}>
            <input
              id={slugify(asset.name)}
              type="radio"
              value={asset.did}
              {...props}
            />
            <label className={styles.radioLabel} htmlFor={slugify(asset.name)}>
              <div className={styles.algorithmLabel}>
                <div>{asset.name}</div>
                <div>+{asset.price} OCEAN</div>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
