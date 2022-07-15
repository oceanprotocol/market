import React, { ReactElement, useEffect, useState } from 'react'
import { useFormikContext } from 'formik'
import Tabs from '@shared/atoms/Tabs'
import { FormPublishData } from '../_types'
import Fixed from './Fixed'
import Free from './Free'
import content from '../../../../content/price.json'
import styles from './index.module.css'
import { useMarketMetadata } from '@context/MarketMetadata'
import { getOceanConfig } from '@utils/ocean'
import { useWeb3 } from '@context/Web3'

export default function PricingFields(): ReactElement {
  const { appConfig } = useMarketMetadata()
  const { chainId } = useWeb3()
  const [defaultBaseToken, setDefaultBaseToken] = useState<TokenInfo>()

  // Connect with main publish form
  const { values, setFieldValue } = useFormikContext<FormPublishData>()
  const { pricing } = values
  const { price, type } = pricing

  useEffect(() => {
    if (!chainId) return

    const oceanConfig = getOceanConfig(chainId)
    setDefaultBaseToken({
      address: oceanConfig?.oceanTokenAddress,
      symbol: oceanConfig?.oceanTokenSymbol,
      decimals: 18,
      name: 'OceanToken'
    })
  }, [chainId])

  // Switch type value upon tab change
  function handleTabChange(tabName: string) {
    const type = tabName.toLowerCase()
    setFieldValue('pricing.type', type)
    setFieldValue('pricing.price', 0)
    setFieldValue('pricing.freeAgreement', false)
    setFieldValue('pricing.baseToken', defaultBaseToken)
    type !== 'free' && setFieldValue('pricing.amountDataToken', 1000)
  }

  // Update price when price is changed
  useEffect(() => {
    setFieldValue('pricing.price', price)
    setFieldValue('pricing.type', type)
  }, [price, setFieldValue, type])

  const tabs = [
    appConfig.allowFixedPricing === 'true'
      ? {
          title: content.create.fixed.title,
          content: (
            <Fixed
              content={content.create.fixed}
              defaultBaseToken={defaultBaseToken}
            />
          )
        }
      : undefined,
    appConfig.allowFreePricing === 'true'
      ? {
          title: content.create.free.title,
          content: <Free content={content.create.free} />
        }
      : undefined
  ].filter((tab) => tab !== undefined)

  return (
    <Tabs
      items={tabs}
      handleTabChange={handleTabChange}
      defaultIndex={type === 'free' ? 1 : 0}
      className={styles.pricing}
      showRadio
    />
  )
}
