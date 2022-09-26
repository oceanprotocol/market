import React, { ReactElement } from 'react'
import styles from './index.module.css'
import Compute from '@images/compute.svg'
import Download from '@images/download.svg'
import Lock from '@images/lock.svg'

export default function AssetType({
  type,
  accessType,
  className,
  totalSales
}: {
  type: string
  accessType: string
  className?: string
  totalSales?: number
}): ReactElement {
  return (
    <div className={className || null}>
      {accessType === 'access' ? (
        <Download role="img" aria-label="Download" className={styles.icon} />
      ) : accessType === 'compute' && type === 'algorithm' ? (
        <Lock role="img" aria-label="Private" className={styles.icon} />
      ) : (
        <Compute role="img" aria-label="Compute" className={styles.icon} />
      )}

      <div className={styles.typeLabel}>
        {type === 'dataset' ? 'dataset' : 'algorithm'}
      </div>

      {(totalSales || totalSales === 0) && (
        <div className={styles.typeLabel}>
          {totalSales < 0
            ? 'N/A'
            : `${totalSales} ${totalSales === 1 ? 'sale' : 'sales'}`}
        </div>
      )}
    </div>
  )
}
