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
  const { price, weightOnDataToken, type } = values as PriceOptionsMarket

  // Switch type value upon tab change
  function handleTabChange(tabName: string) {
    const type = tabName.toLowerCase()
    setFieldValue('type', type)
  }

  // Always update everything when price value changes
  useEffect(() => {
    const dtAmount = Number(price) * Number(weightOnDataToken)
    setFieldValue('dtAmount', dtAmount)
  }, [price])

  const tabs = [
    {
      title: content.fixed.title,
      content: <Fixed content={content.fixed} ddo={ddo} />
    },
    {
      title: content.dynamic.title,
      content: <Dynamic content={content.dynamic} ddo={ddo} />
    }
  ]

  return (
    <>
      <Tabs
        items={tabs}
        handleTabChange={handleTabChange}
        defaultIndex={type === 'fixed' ? 0 : 1}
      />

      <div className={styles.actions}>
        <Button style="primary" onClick={() => submitForm()}>
          {content.empty.action}
        </Button>
        <Button style="text" size="small" onClick={() => setShowPricing(false)}>
          Cancel
        </Button>
      </div>

      {debug === true && (
        <pre>
          <code>{JSON.stringify(values, null, 2)}</code>
        </pre>
      )}
    </>
  )
}
