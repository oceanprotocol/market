import React, { ReactElement } from 'react'
import styles from './AssetType.module.css'
import classNames from 'classnames/bind'
import { ReactComponent as Compute } from '../../images/compute.svg'
import { ReactComponent as Download } from '../../images/download.svg'
import { ReactComponent as Lock } from '../../images/lock.svg'
import NetworkName from './NetworkName'
import { useOcean } from '../../providers/Ocean'

const cx = classNames.bind(styles)

export default function AssetType({
  type,
  accessType,
  className,
  chainId
}: {
  type: string
  accessType: string
  chainId: number
  className?: string
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
      {/* TODO: networkId needs to come from the multinetwork DDO for each asset */}
      {chainId && (
        <NetworkName networkId={chainId} className={styles.network} minimal />
      )}
    </div>
  )
}
