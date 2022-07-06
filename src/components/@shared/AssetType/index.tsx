import React, { ReactElement } from 'react'
import styles from './index.module.css'
import classNames from 'classnames/bind'
import Compute from '@images/compute.svg'
import Download from '@images/download.svg'
import Lock from '@images/lock.svg'

const cx = classNames.bind(styles)

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
  const styleClasses = cx({
    [className]: className
  })
  return (
    <div className={styleClasses}>
      {accessType === 'access' ? (
        <Download role="img" aria-label="Download" className={styles.icon} />
      ) : accessType === 'compute' && type === 'algorithm' ? (
        <Lock role="img" aria-label="Private" className={styles.icon} />
      ) : (
        <Compute role="img" aria-label="Compute" className={styles.icon} />
      )}

      <div className={styles.typeLabel}>
        {type === 'dataset' ? 'data set' : 'algorithm'}
      </div>

      <div className={styles.typeLabel}>
        {totalSales + ' ' + (totalSales === 1 ? 'sale' : 'sales')}
      </div>
    </div>
  )
}
