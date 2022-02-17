import { Asset } from '@oceanprotocol/lib'
import AssetType from '@shared/AssetType'
import Time from '@shared/atoms/Time'
import { getServiceByName } from '@utils/ddo'
import React, { ReactElement } from 'react'
import styles from './MetaInfo.module.css'

export default function MetaInfo({ ddo }: { ddo: Asset }): ReactElement {
  const isCompute = Boolean(getServiceByName(ddo, 'compute'))
  const accessType = isCompute ? 'compute' : 'access'

  return (
    <div className={styles.wrapper}>
      <AssetType
        type={ddo?.metadata.type}
        accessType={accessType}
        className={styles.assetType}
      />
      <div className={styles.byline}>
        <p>
          Published <Time date={ddo?.metadata.created} relative />
          {ddo?.metadata.created !== ddo?.metadata.updated && (
            <>
              {' — '}
              <span className={styles.updated}>
                updated <Time date={ddo?.metadata.updated} relative />
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
