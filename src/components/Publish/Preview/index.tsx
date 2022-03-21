import React, { ReactElement, useEffect, useState } from 'react'
import styles from './index.module.css'
import { FormPublishData } from '../_types'
import { useFormikContext } from 'formik'
import AssetContent from 'src/components/Asset/AssetContent'
import { transformPublishFormToDdo } from '../_utils'
import { AssetExtended } from 'src/@types/AssetExtended'
import { ZERO_ADDRESS } from '@oceanprotocol/lib'

export default function Preview(): ReactElement {
  const [asset, setAsset] = useState<AssetExtended>()
  const { values } = useFormikContext<FormPublishData>()

  useEffect(() => {
    async function makeDdo() {
      const asset = (await transformPublishFormToDdo(values)) as AssetExtended
      // dummy BestPrice to trigger certain AssetActions
      asset.accessDetails = {
        type: values.pricing.type,
        addressOrId: ZERO_ADDRESS,
        price: values.pricing.price,
        baseToken: {
          address: ZERO_ADDRESS,
          name: 'OCEAN',
          symbol: 'OCEAN'
        },
        datatoken: {
          address: ZERO_ADDRESS,
          name: '',
          symbol: ''
        },
        isPurchasable: true,
        isOwned: false,
        validOrderTx: ''
      }
      setAsset(asset)
    }
    makeDdo()
  }, [values])

  return (
    <div className={styles.preview}>
      <h2 className={styles.previewTitle}>Preview</h2>

      <h3 className={styles.assetTitle}>{values.metadata.name}</h3>
      {asset && <AssetContent asset={asset} />}
    </div>
  )
}
