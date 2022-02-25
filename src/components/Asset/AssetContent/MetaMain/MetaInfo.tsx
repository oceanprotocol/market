import { Asset } from '@oceanprotocol/lib'
import AssetType from '@shared/AssetType'
import Time from '@shared/atoms/Time'
import { getServiceByName } from '@utils/ddo'
import React, { ReactElement } from 'react'
import styles from './MetaInfo.module.css'

export default function MetaInfo({ asset }: { asset: Asset }): ReactElement {
  const isCompute = Boolean(getServiceByName(asset, 'compute'))
  const accessType = isCompute ? 'compute' : 'access'

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
