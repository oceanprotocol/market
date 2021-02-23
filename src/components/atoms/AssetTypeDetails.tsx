import React, { ReactElement } from 'react'
import styles from './AssetTypeDetails.module.css'
import { ReactComponent as Compute } from '../../images/compute.svg'
import { ReactComponent as Download } from '../../images/download.svg'

export default function AssetTypeDetails({
  type,
  accessType
}: {
  type: string
  accessType: string
}): ReactElement {
  return (
    <aside className={styles.typeDetails}>
      <div className={styles.typeLabel}>
        {type === 'dataset' ? 'data set' : 'algorithm'}
      </div>
      {accessType === 'access' ? (
        <Download role="img" aria-label="Download" className={styles.icon} />
      ) : (
        <Compute role="img" aria-label="Compute" className={styles.icon} />
      )}
    </aside>
  )
}
