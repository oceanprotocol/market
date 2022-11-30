import React, { ReactElement, useEffect, useState } from 'react'
import { Form, Formik } from 'formik'
import { Assets } from './Assets'
import { Custom } from './Custom'
import isUrl from 'is-url-superb'
import styles from './index.module.css'
import { DEFAULT_NEW_CUSTOM_SIGNAL } from '../_constants'
import { useUserPreferences } from '@context/UserPreferences'
import { SignalOriginItem } from '@context/Signals/_types'
import slugify from 'slugify'
import { toast } from 'react-toastify'

export default function AssetSignalsTab(props: {
  accountId: string
  signalSettings: SignalOriginItem[]
  signalType: number
  signalTypeTitle: string
}): ReactElement {
  // This `feedback` state is auto-synced into Formik context under `values.feedback`
  // for use in other components. Syncing defined in ./Steps.tsx child component.
  const { addSignalSetting, removeSignalSetting, updateSignalSetting } =
    useUserPreferences()
  const signalSettingsDisplayValues: {
    [key: string]: string | boolean | number
  } = {}
  props.signalSettings.forEach((signalOrigin) => {
    if (!(signalOrigin.type === props.signalType)) {
      return
    }
    const listKeyName = `${signalOrigin.id}_${signalOrigin.listView.id}`
    const detailKeyName = `${signalOrigin.id}_${signalOrigin.detailView.id}`
    signalSettingsDisplayValues[listKeyName] = signalOrigin.listView.value
    signalSettingsDisplayValues[detailKeyName] = signalOrigin.detailView.value
  })
  const [initialValues, setInitialValues] = useState({
    title: DEFAULT_NEW_CUSTOM_SIGNAL.title,
    type: props.signalType,
    origin: '',
    ...signalSettingsDisplayValues
  })
  const initializeFormValues = () => {
    props.signalSettings.forEach((item, index) => {
      if (!(item.type === props.signalType)) {
        return
      }
      setInitialValues((prevState) => {
        const listKeyName = `${item.id}_${item.listView.id}`
        const detailKeyName = `${item.id}_${item.detailView.id}`
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

  function handleRemoveSignal(signalOrigin: SignalOriginItem) {
    removeSignalSetting(signalOrigin.id)
    toast.warn('Removed ' + signalOrigin.title + ' from custom asset signals')
  }

  function handleSignalItemUpdate(
    oldItem: SignalOriginItem,
    newItem: SignalOriginItem
  ) {
    updateSignalSetting(oldItem, newItem)
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
              toast.success(
                'Added ' + values.title + ' to custom asset signals'
              )
              const signalOrigin = {
                ...DEFAULT_NEW_CUSTOM_SIGNAL,
                id: `custom-signal-${slugify(values.title.toLowerCase())}-${
                  props.signalSettings.length + 1
                }`,
                type: props.signalType,
                title: values.title,
                description: `${values.title} is an unverified custom signal.`,
                origin: values.origin,
                urlParams: {
                  ...DEFAULT_NEW_CUSTOM_SIGNAL.urlParams,
                  assetIds: [assetId]
                }
              }
              const newListViewKeyName = `${signalOrigin.id}_${signalOrigin.listView.id}`
              const newDetailViewKeyName = `${signalOrigin.id}_${signalOrigin.detailView.id}`
              addSignalSetting(signalOrigin)
              actions.setValues({
                ...values,
                [newListViewKeyName]: signalOrigin.listView.value,
                [newDetailViewKeyName]: signalOrigin.detailView.value
              })
              actions.setSubmitting(false)
            }, 500)
          } else {
            alert('The URL provided is not valid')
          }
        }}
      >
        <Form>
          <Assets
            handleRemoveSignal={handleRemoveSignal}
            handleSignalItemUpdate={handleSignalItemUpdate}
          />
          <Custom />
        </Form>
      </Formik>
    </div>
  )
}
