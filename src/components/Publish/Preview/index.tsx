import React, { ReactElement, useEffect, useState } from 'react'
import styles from './index.module.css'
import { FormPublishData } from '../_types'
import { useFormikContext } from 'formik'
import AssetContent from '@components/Asset/AssetContent'
import { transformPublishFormToDdo } from '../_utils'
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
        templateId: 1,
        price: `${values.pricing.price}`,
        baseToken: {
          address: ZERO_ADDRESS,
          name: values.pricing?.baseToken?.symbol || 'OCEAN',
          symbol: values.pricing?.baseToken?.symbol || 'OCEAN'
        },
        datatoken: {
          address: ZERO_ADDRESS,
          name: '',
          symbol: ''
        },
        isPurchasable: true,
        isOwned: false,
        validOrderTx: '',
        publisherMarketOrderFee: '0'
      }
      asset.stats = {
        orders: null,
        price: {
          value: values.pricing.type === 'free' ? 0 : values.pricing.price,
          tokenSymbol: values.pricing?.baseToken?.symbol || 'OCEAN',
          tokenAddress: ZERO_ADDRESS
        }
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
