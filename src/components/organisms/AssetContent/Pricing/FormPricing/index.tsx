import React, { ReactElement, useEffect } from 'react'
import styles from './index.module.css'
import Tabs from '../../../../atoms/Tabs'
import Fixed from './Fixed'
import Dynamic from './Dynamic'
import { useFormikContext } from 'formik'
import { useUserPreferences } from '../../../../../providers/UserPreferences'
import { PriceOptionsMarket } from '../../../../../@types/MetaData'
import Button from '../../../../atoms/Button'
import { DDO } from '@oceanprotocol/lib'
import FormHelp from '../../../../atoms/Input/Help'
import appConfig from '../../../../../../app.config'

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

  // Connect with form
  const { values, setFieldValue, submitForm } = useFormikContext()
  const {
    price,
    oceanAmount,
    weightOnOcean,
    weightOnDataToken,
    type
  } = values as PriceOptionsMarket

  // Switch type value upon tab change
  function handleTabChange(tabName: string) {
    const type = tabName.toLowerCase()
    setFieldValue('type', type)
    type === 'fixed' && setFieldValue('dtAmount', 1000)
  }

  // Return the allowed pricing option tab
  function getAllowedPricingOption() {
    const tabs = []
    if (appConfig.allowFREPricing === 'true')
      tabs.push({
        title: content.fixed.title,
        content: <Fixed content={content.fixed} ddo={ddo} />
      })
    if (appConfig.allowDynamicPricing === 'true')
      tabs.push({
        title: content.dynamic.title,
        content: <Dynamic content={content.dynamic} ddo={ddo} />
      })
    return tabs
  }

  // Always update everything when price value changes
  useEffect(() => {
    if (type === 'fixed') return
    const dtAmount =
      (Number(oceanAmount) / Number(weightOnOcean) / price) *
      Number(weightOnDataToken)

    setFieldValue('dtAmount', dtAmount)
  }, [price, oceanAmount, weightOnOcean, weightOnDataToken, type])

  const tabs = getAllowedPricingOption()

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
