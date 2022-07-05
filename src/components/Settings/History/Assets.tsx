import { useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import { FormSettingsData } from '../_types'
import styles from './Asset.module.css'

export function Assets(): ReactElement {
  const { values } = useFormikContext<FormSettingsData>()

  const items = Object.entries(values.assets).map(([key, value], index) => (
    <li key={index} className={styles[value.status]}>
      <h3 className={styles.title}>{value.name}</h3>
      <p className={styles.description}>{value.description}</p>
      {value.errorMessage && (
        <span title={value.errorMessage} className={styles.errorMessage}>
          {value.errorMessage}
        </span>
      )}
    </li>
  ))

  return <ol className={styles.assets}>{items}</ol>
}
