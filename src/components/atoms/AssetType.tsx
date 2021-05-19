import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import { ReactComponent as Compute } from '../../images/compute.svg'
import { ReactComponent as Download } from '../../images/download.svg'
import { ReactComponent as Lock } from '../../images/lock.svg'
import * as styles from './AssetType.module.css'

const cx = classNames.bind(styles)

export default function AssetType({
  type,
  accessType,
  className
}: {
  type: string
  accessType: string
  className?: string
}): ReactElement {
  const styleClasses = cx({
    [className]: className
  })
  return (
    <div className={styleClasses}>
      <div className={styles.typeLabel}>
        {type === 'dataset' ? 'data set' : 'algorithm'}
      </div>
      {accessType === 'access' ? (
        <Download role="img" aria-label="Download" className={styles.icon} />
      ) : accessType === 'compute' && type === 'algorithm' ? (
        <Lock role="img" aria-label="Private" className={styles.icon} />
      ) : (
        <Compute role="img" aria-label="Compute" className={styles.icon} />
      )}
    </div>
  )
}
