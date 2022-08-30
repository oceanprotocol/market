import React, { ReactElement, useState } from 'react'
import { useFormikContext } from 'formik'
import { FormPublishData } from 'src/components/Publish/_types'
import styles from './index.module.css'

export default function MyPreview(): ReactElement {
  const [asset, setAsset] = useState<AssetExtended>()
  const { values } = useFormikContext<FormPublishData>()

  return (
    <div className={styles.preview}>
      <h2 className={styles.previewTitle}>MyPreview</h2>

      <h3 className={styles.assetTitle}>{values?.metadata?.name}</h3>
      {/* {asset && <AssetContent asset={asset} />} */}
    </div>
  )
}
