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

export default function PricingFields(): ReactElement {
  const { appConfig } = useMarketMetadata()

  // Connect with main publish form
  const { values, setFieldValue } = useFormikContext<FormPublishData>()
  const { pricing } = values
  const { price, type } = pricing

  // Switch type value upon tab change
  function handleTabChange(tabName: string) {
    const type = tabName.toLowerCase()
    setFieldValue('pricing.type', type)
    setFieldValue('pricing.price', 0)
    setFieldValue('pricing.freeAgreement', false)
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
          content: <Fixed content={content.create.fixed} />
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
