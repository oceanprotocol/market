import React, { ReactElement, useEffect, useState } from 'react'
import { Form, Formik } from 'formik'
import { Assets } from './Assets'
import { Custom } from './Custom'
import isUrl from 'is-url-superb'
import styles from './index.module.css'
import { DEFAULT_NEW_CUSTOM_SIGNAL } from '../_constants'
import { useUserPreferences } from '../../../@context/UserPreferences'
import { SignalOriginItem } from '../../../@context/Signals/_types'
import slugify from 'slugify'

export default function AssetSignalsTab(props: {
  accountId: string
  signalSettings: SignalOriginItem[]
}): ReactElement {
  // This `feedback` state is auto-synced into Formik context under `values.feedback`
  // for use in other components. Syncing defined in ./Steps.tsx child component.
  const { addSignalSetting, removeSignalSetting, signalSettings } =
    useUserPreferences()

  const signalSettingsDisplayValues: {
    [key: string]: string | boolean | number
  } = {}
  props.signalSettings.forEach((signalOrigin) => {
    if (!(signalOrigin.type === 1)) {
      return
    }
    const listKeyName = `${signalOrigin.id + signalOrigin.listView.id}`
    const detailKeyName = `${signalOrigin.id + signalOrigin.detailView.id}`
    signalSettingsDisplayValues[listKeyName] = signalOrigin.listView.value
    signalSettingsDisplayValues[detailKeyName] = signalOrigin.detailView.value
  })
  const [initialValues, setInitialValues] = useState({
    title: DEFAULT_NEW_CUSTOM_SIGNAL.title,
    type: 1,
    origin: '',
    ...signalSettingsDisplayValues
  })
  const initializeFormValues = () => {
    props.signalSettings.forEach((item) => {
      if (!(item.type === 1)) {
        return
      }
      setInitialValues((prevState) => {
        const listKeyName = `${item.id + item.listView.id}`
        const detailKeyName = `${item.id + item.detailView.id}`
        return {
          ...prevState,
          [listKeyName]: item.listView.value,
          [detailKeyName]: item.detailView.value
        }
      })
    })
  }
  useEffect(() => {
    initializeFormValues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.signalSettings])

  function handleRemoveSignal(signalOriginId: string) {
    removeSignalSetting(signalOriginId)
  }

  return (
    <div className={styles.submission}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          if (isUrl(values.origin)) {
            const urlPaths = new URL(
              values.origin.toLowerCase()
            ).pathname.split('/')
            const assetId = urlPaths[urlPaths.length - 1]
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2))
              const signalOrigin = {
                ...DEFAULT_NEW_CUSTOM_SIGNAL,
                id: `custom-signal-${slugify(values.title.toLowerCase())}-${
                  props.signalSettings.length + 1
                }`,
                type: 1,
                title: values.title,
                origin: values.origin,
                urlParams: {
                  ...DEFAULT_NEW_CUSTOM_SIGNAL.urlParams,
                  assetIds: [assetId]
                }
              }
              const newListViewKeyName = `${
                signalOrigin.id + signalOrigin.listView.id
              }`
              const newDetailViewKeyName = `${
                signalOrigin.id + signalOrigin.detailView.id
              }`
              addSignalSetting(signalOrigin)
              actions.setValues({
                ...values,
                [newListViewKeyName]: signalOrigin.listView.value,
                [newDetailViewKeyName]: signalOrigin.detailView.value
              })
              actions.setSubmitting(false)
            }, 1000)
          } else {
            alert('The URL provided is not valid')
          }
        }}
      >
        <Form>
          <Assets handleRemoveSignal={handleRemoveSignal} />
          <Custom />
        </Form>
      </Formik>
    </div>
  )
}
