import React from 'react'
import Dotdotdot from 'react-dotdotdot'
import slugify from 'slugify'
import PriceUnit from '../../atoms/Price/PriceUnit'
import { ReactComponent as External } from '../../../images/external.svg'
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
      {assets.map((asset: AssetSelectionAsset) => (
        <div className={styles.row} key={asset.did}>
          <input
            id={slugify(asset.did)}
            type={multiple ? 'checkbox' : 'radio'}
            value={asset.did}
            className={styles.input}
            {...props}
          />
          <div className={styles.content}>
            <label
              className={styles.label}
              htmlFor={slugify(asset.name)}
              title={asset.name}
            >
              <Dotdotdot clamp={1} tagName="h3" className={styles.title}>
                {asset.name}
              </Dotdotdot>
              <PriceUnit price={asset.price} small className={styles.price} />
            </label>

            <a
              className={styles.link}
              href={`/asset/${asset.did}`}
              target="_blank"
              rel="noreferrer"
            >
              <External />
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
