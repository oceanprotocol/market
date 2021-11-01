import React, { ReactElement, useEffect } from 'react'
import { useFormikContext } from 'formik'
import { DDO } from '@oceanprotocol/lib'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import Tabs from '@shared/atoms/Tabs'
import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import { FormPublishData } from '../_types'
import Dynamic from './Dynamic'
import Fixed from './Fixed'
import Free from './Free'
import content from '../../../../content/price.json'
import styles from './index.module.css'

export default function PricingFields(): ReactElement {
  const { appConfig } = useSiteMetadata()

  // Connect with main publish form
  const { values, setFieldValue } = useFormikContext<FormPublishData>()
  const { pricing } = values
  const { price, amountOcean, weightOnOcean, weightOnDataToken, type } = pricing

  // Switch type value upon tab change
  function handleTabChange(tabName: string) {
    const type = tabName.toLowerCase()
    setFieldValue('pricing.type', type)
    type === 'fixed' && setFieldValue('pricing.amountDataToken', 1000)
    type === 'free' && price < 1 && setFieldValue('pricing.price', 1)
  }

  // Always update everything when price value changes
  useEffect(() => {
    if (type === 'fixed' || type === 'free') return

    const amountDataToken =
      isValidNumber(amountOcean) &&
      isValidNumber(weightOnOcean) &&
      isValidNumber(price) &&
      isValidNumber(weightOnDataToken)
        ? new Decimal(amountOcean)
            .dividedBy(new Decimal(weightOnOcean))
            .dividedBy(new Decimal(price))
            .mul(new Decimal(weightOnDataToken))
        : 0

    setFieldValue('pricing.amountDataToken', amountDataToken)
  }, [price, amountOcean, weightOnOcean, weightOnDataToken, type])

  const tabs = [
    appConfig.allowFixedPricing === 'true'
      ? {
          title: content.create.fixed.title,
          content: <Fixed content={content.create.fixed} />
        }
      : undefined,
    appConfig.allowDynamicPricing === 'true'
      ? {
          title: content.create.dynamic.title,
          content: <Dynamic content={content.create.dynamic} />
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
      defaultIndex={type === 'fixed' ? 0 : type === 'dynamic' ? 1 : 2}
      className={styles.pricing}
    />
  )

  // async function handleCreatePricing(values: PriceOptions) {
  //   try {
  //     const priceOptions = {
  //       ...values,
  //       // swapFee is tricky: to get 0.1% you need to send 0.001 as value
  //       swapFee: `${values.swapFee / 100}`
  //     }

  //     const tx = await createPricing(priceOptions, ddo)

  //     // Pricing failed
  //     if (!tx || pricingError) {
  //       toast.error(pricingError || 'Price creation failed.')
  //       Logger.error(pricingError || 'Price creation failed.')
  //       return
  //     }

  //     // Pricing succeeded
  //     setSuccess(
  //       `🎉 Successfully created a ${values.type} price. 🎉 Reload the page to get all updates.`
  //     )
  //     Logger.log(`Transaction: ${tx}`)
  //   } catch (error) {
  //     toast.error(error.message)
  //     Logger.error(error.message)
  //   }
  // }
}
