import React, { ReactElement } from 'react'
import { ReactComponent as Compute } from '../../images/compute.svg'
import { ReactComponent as Download } from '../../images/download.svg'
import { ReactComponent as Lock } from '../../images/lock.svg'
import { typeLabel, icon } from './AssetType.module.css'

export default function AssetType({
  type,
  accessType,
  className
}: {
  type: string
  accessType: string
  className?: string
}): ReactElement {
  return (
    <div className={`${className}`}>
      <div className={typeLabel}>
        {type === 'dataset' ? 'data set' : 'algorithm'}
      </div>
      {accessType === 'access' ? (
        <Download role="img" aria-label="Download" className={icon} />
      ) : accessType === 'compute' && type === 'algorithm' ? (
        <Lock role="img" aria-label="Private" className={icon} />
      ) : (
        <Compute role="img" aria-label="Compute" className={icon} />
      )}
    </div>
  )
}
