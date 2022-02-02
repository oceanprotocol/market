import React, { ReactElement, useEffect, useState } from 'react'
import styles from './index.module.css'
import { FormPublishData } from '../_types'
import { useFormikContext } from 'formik'
import AssetContent from 'src/components/Asset/AssetContent'
import { transformPublishFormToDdo } from '../_utils'
import { Asset } from '@oceanprotocol/lib'

export default function Preview(): ReactElement {
  const [asset, setAsset] = useState<Asset>()
  const [accessDetails, setAccessDetails] = useState<AccessDetails>()
  const { values } = useFormikContext<FormPublishData>()

  useEffect(() => {
    async function makeDdo() {
      const asset = await transformPublishFormToDdo(values)
      setAsset(asset as Asset)

      // dummy BestPrice to trigger certain AssetActions
      const accessDetails: AccessDetails = {
        type: values.pricing.type,
        addressOrId: '0x...',
        price: values.pricing.price,
        baseToken: {
          address: '0x..',
          name: '',
          symbol: ''
        },
        datatoken: {
          address: '0x..',
          name: '',
          symbol: ''
        },
        owned: false,
        validOrderTx: ''
      }
      setAccessDetails(accessDetails)
    }
    makeDdo()
  }, [values])

  return (
    <div className={styles.preview}>
      <h2 className={styles.previewTitle}>Preview</h2>

      <h3 className={styles.assetTitle}>{values.metadata.name}</h3>
      <AssetContent asset={asset} accessDetails={accessDetails} />
    </div>
  )
}
