import React, { ReactElement, useEffect, useState } from 'react'
import styles from './index.module.css'
import { FormPublishData } from '../_types'
import { useFormikContext } from 'formik'
import AssetContent from 'src/components/Asset/AssetContent'
import { transformPublishFormToDdo } from '../_utils'
import { Asset } from '@oceanprotocol/lib'

export default function Preview(): ReactElement {
  const [ddo, setDdo] = useState<Asset>()
  const [price, setPrice] = useState<BestPrice>()
  const { values } = useFormikContext<FormPublishData>()

  useEffect(() => {
    async function makeDdo() {
      const ddo = await transformPublishFormToDdo(values)
      setDdo(ddo as Asset)

      // dummy BestPrice to trigger certain AssetActions
      const price: BestPrice = {
        type: values.pricing.type,
        address: '0x...',
        value: values.pricing.price,
        pools: [],
        oceanSymbol: 'OCEAN'
      }
      setPrice(price)
    }
    makeDdo()
  }, [values])

  return (
    <div className={styles.preview}>
      <h2 className={styles.previewTitle}>Preview</h2>

      <h3 className={styles.assetTitle}>{values.metadata.name}</h3>
      <AssetContent ddo={ddo} price={price} />
    </div>
  )
}
