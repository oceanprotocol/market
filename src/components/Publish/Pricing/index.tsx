import React, { ReactElement, useEffect } from 'react'
import { useFormikContext } from 'formik'
import Tabs from '@shared/atoms/Tabs'
import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import { FormPublishData } from '../_types'
import { initialValues } from '../_constants'
import Dynamic from './Dynamic'
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
  const oceanConfig = getOceanConfig(chainId)

  // Connect with main publish form
  const { values, setFieldValue } = useFormikContext<FormPublishData>()
  const { pricing } = values
  const { price, amountBaseToken, weightOnBaseToken, weightOnDataToken, type } =
    pricing

  const defaultBaseToken: TokenInfo = {
    address: oceanConfig?.oceanTokenAddress,
    symbol: oceanConfig?.oceanTokenSymbol,
    decimals: 18,
    name: 'OceanToken'
  }

  // Switch type value upon tab change
  function handleTabChange(tabName: string) {
    const type = tabName.toLowerCase()
    setFieldValue('pricing.type', type)
    setFieldValue('pricing.price', 0)
    setFieldValue('pricing.freeAgreement', false)
    setFieldValue('pricing.baseToken', defaultBaseToken)
    type !== 'free' && setFieldValue('pricing.amountDataToken', 1000)
  }

  // Update ocean amount when price is changed
  useEffect(() => {
    if (type === 'fixed' || type === 'free') return

    const amountBaseToken =
      isValidNumber(weightOnBaseToken) && isValidNumber(price) && price > 0
        ? new Decimal(price).mul(new Decimal(weightOnBaseToken).mul(10)).mul(2)
        : new Decimal(initialValues.pricing.amountBaseToken)

    setFieldValue('pricing.amountBaseToken', amountBaseToken)
  }, [price, weightOnBaseToken, type, setFieldValue])

  // Update dataToken value when ocean amount is changed
  useEffect(() => {
    if (type === 'fixed' || type === 'free') return

    const amountDataToken =
      isValidNumber(amountBaseToken) &&
      isValidNumber(weightOnBaseToken) &&
      isValidNumber(price) &&
      isValidNumber(weightOnDataToken) &&
      price > 0
        ? new Decimal(amountBaseToken)
            .dividedBy(new Decimal(weightOnBaseToken))
            .dividedBy(new Decimal(price))
            .mul(new Decimal(weightOnDataToken))
        : new Decimal(initialValues.pricing.amountDataToken)

    setFieldValue('pricing.amountDataToken', amountDataToken)
  }, [
    amountBaseToken,
    weightOnBaseToken,
    weightOnDataToken,
    type,
    setFieldValue
  ])

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
    appConfig.allowDynamicPricing === 'true'
      ? {
          title: content.create.dynamic.title,
          content: (
            <Dynamic
              content={content.create.dynamic}
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
      defaultIndex={type === 'dynamic' ? 1 : type === 'free' ? 2 : 0}
      className={styles.pricing}
      showRadio
    />
  )
}
