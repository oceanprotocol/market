import AssetType from '@shared/AssetType'
import Time from '@shared/atoms/Time'
import Publisher from '@shared/Publisher'
import React, { ReactElement } from 'react'
import styles from './MetaInfo.module.css'

export default function MetaInfo({
  asset,
  nftPublisher
}: {
  asset: AssetExtended
  nftPublisher: string
}): ReactElement {
  const accessType = 'access'
  const nftOwner = asset?.nft?.owner

  return (
    <div className={styles.wrapper}>
      <AssetType
        type={asset?.metadata.type}
        accessType={accessType}
        className={styles.assetType}
      />
      <div className={styles.byline}>
        <p>
          Published <Time date={asset?.metadata.created} relative />
          {nftPublisher && nftPublisher !== nftOwner && (
            <span>
              {' by '} <Publisher account={nftPublisher} />
            </span>
          )}
          {asset?.metadata.created !== asset?.metadata.updated && (
            <>
              {' — '}
              <span className={styles.updated}>
                updated <Time date={asset?.metadata.updated} relative />
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
