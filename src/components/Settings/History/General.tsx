import React, { ReactElement } from 'react'
import { Form, Formik } from 'formik'
import styles from './index.module.css'
import TokenApproval from '../../Header/UserPreferences/TokenApproval'
import Currency from '../../Header/UserPreferences/Currency'
import Appearance from '../../Header/UserPreferences/Appearance'
import useDarkMode from 'use-dark-mode'
import Debug from '../../Header/UserPreferences/Debug'
import { useMarketMetadata } from '@context/MarketMetadata'
import { initialValues } from '../_constants'
import { validationSchema } from '../_validation'

export default function GeneralTab(): ReactElement {
  const { appConfig } = useMarketMetadata()
  const { darkModeConfig, signalSettings } = appConfig
  const darkMode = useDarkMode(false, darkModeConfig)
  const textVisible = true
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            actions.setSubmitting(false)
          }, 1000)
        }}
      >
        <Form>
          <ul className={styles.generalDetails}>
            <Currency textVisible={textVisible} />
            <TokenApproval />
            <Appearance darkMode={darkMode} />
            <Debug />
          </ul>
        </Form>
      </Formik>
    </>
  )
}
