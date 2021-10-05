import React, { ReactElement, useEffect } from 'react'
import styles from './index.module.css'
import Tabs from '../../../../atoms/Tabs'
import Fixed from './Fixed'
import Dynamic from './Dynamic'
import Free from './Free'
import { useFormikContext } from 'formik'
import { useUserPreferences } from '../../../../../providers/UserPreferences'
import { PriceOptionsMarket } from '../../../../../@types/MetaData'
import Button from '../../../../atoms/Button'
import { DDO } from '@oceanprotocol/lib'
import FormHelp from '../../../../atoms/Input/Help'
import { useSiteMetadata } from '../../../../../hooks/useSiteMetadata'

import { isValidNumber } from './../../../../../utils/numberValidations'
import Decimal from 'decimal.js'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

export default function FormPricing({
  ddo,
  setShowPricing,
  content
}: {
  ddo: DDO
  setShowPricing: (value: boolean) => void
  content: any
}): ReactElement {
  const { debug } = useUserPreferences()
  const { appConfig } = useSiteMetadata()

  // Connect with form
  const { values, setFieldValue, submitForm } = useFormikContext()
  const { price, oceanAmount, weightOnOcean, weightOnDataToken, type } =
    values as PriceOptionsMarket

  // Switch type value upon tab change
  function handleTabChange(tabName: string) {
    const type = tabName.toLowerCase()
    setFieldValue('type', type)
    type === 'fixed' && setFieldValue('dtAmount', 1000)
    type === 'free' && price < 1 && setFieldValue('price', 1)
  }

  // Always update everything when price value changes
  useEffect(() => {
    if (type === 'fixed') return
    const dtAmount =
      isValidNumber(oceanAmount) &&
      isValidNumber(weightOnOcean) &&
      isValidNumber(price) &&
      isValidNumber(weightOnDataToken)
        ? new Decimal(oceanAmount)
            .dividedBy(new Decimal(weightOnOcean))
            .dividedBy(new Decimal(price))
            .mul(new Decimal(weightOnDataToken))
        : 0

    setFieldValue('dtAmount', dtAmount)
  }, [price, oceanAmount, weightOnOcean, weightOnDataToken, type])

  const tabs = [
    appConfig.allowFixedPricing === 'true'
      ? {
          title: content.fixed.title,
          content: <Fixed content={content.fixed} ddo={ddo} />
        }
      : undefined,
    appConfig.allowDynamicPricing === 'true'
      ? {
          title: content.dynamic.title,
          content: <Dynamic content={content.dynamic} ddo={ddo} />
        }
      : undefined,
    appConfig.allowFreePricing === 'true'
      ? {
          title: content.free.title,
          content: <Free content={content.free} ddo={ddo} />
        }
      : undefined
  ].filter((tab) => tab !== undefined)

  return (
    <>
      <Tabs
        items={tabs}
        handleTabChange={handleTabChange}
        defaultIndex={type === 'fixed' ? 0 : 1}
      />

      <div className={styles.actions}>
        <Button style="primary" onClick={() => submitForm()}>
          {content.empty.action.name}
        </Button>
        <Button style="text" size="small" onClick={() => setShowPricing(false)}>
          Cancel
        </Button>
        <FormHelp className={styles.actionsHelp}>
          {content.empty.action.help}
        </FormHelp>
      </div>

      {debug === true && (
        <pre>
          <code>{JSON.stringify(values, null, 2)}</code>
        </pre>
      )}
    </>
  )
}
