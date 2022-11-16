import { AssetSignalItem, SignalOriginItem } from '@context/Signals/_types'
import styles from '@shared/atoms/AssetSignals/index.module.css'
import UtuIcon from '@images/utu-logo.svg'
import React from 'react'
import { LoaderArea } from '@shared/AssetList'

export interface AssetDetailsSignalProps {
  item: SignalOriginItem
  sig: AssetSignalItem
}

export function AssetDetailsSignalSummary({
  sig,
  item
}: {
  sig: any
  item: any
}) {
  return (
    <li key={sig.id + item.title}>
      {sig ? (
        <div className={styles.assetListTitle}>
          <div className={styles.assetListTitleName}>
            <p>
              <UtuIcon className={styles.assetListIcon} />
            </p>
            <p> {item.title} </p>
          </div>
          <div className={styles.assetListTitleNumber}>
            {sig.value ? sig.value : 'N/A'}
          </div>
        </div>
      ) : (
        <LoaderArea />
      )}
    </li>
  )
}
