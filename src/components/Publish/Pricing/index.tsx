import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useFormikContext } from 'formik'
import Tabs from '@shared/atoms/Tabs'
import { FormPublishData } from '../_types'
import Fixed from './Fixed'
import Free from './Free'
import content from '../../../../content/price.json'
import styles from './index.module.css'
import { useMarketMetadata } from '@context/MarketMetadata'
import { useWeb3 } from '@context/Web3'

export default function PricingFields(): ReactElement {
  const { appConfig } = useMarketMetadata()
  const { approvedBaseTokens, chainId } = useWeb3()
  // Connect with main publish form
  const { values, setFieldValue } = useFormikContext<FormPublishData>()
  const { pricing } = values
  const { type } = pricing

  const defaultBaseToken =
    approvedBaseTokens?.find((token) =>
      token.name.toLowerCase().includes('ocean')
    ) || approvedBaseTokens?.[0]

  // Switch type value upon tab change
  function handleTabChange(tabName: string) {
    const type = tabName.toLowerCase()
    setFieldValue('pricing.type', type)
    setFieldValue('pricing.price', 0)
    setFieldValue('pricing.freeAgreement', false)
    setFieldValue('pricing.baseToken', defaultBaseToken)
    type !== 'free' && setFieldValue('pricing.amountDataToken', 1000)
  }

  const updateTabs = useCallback(() => {
    return [
      appConfig.allowFixedPricing === 'true'
        ? {
            title: content.create.fixed.title,
            content: (
              <Fixed
                approvedBaseTokens={approvedBaseTokens}
                content={content.create.fixed}
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
  }, [
    appConfig.allowFixedPricing,
    appConfig.allowFreePricing,
    approvedBaseTokens
  ])

  const [tabs, setTabs] = useState(updateTabs())

  useEffect(() => {
    setTabs(updateTabs())
  }, [updateTabs])

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
