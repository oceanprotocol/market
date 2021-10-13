import { useField } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import { utils } from '@oceanprotocol/lib'
import { InputProps } from '@shared/Form/Input'
import RefreshName from './RefreshName'
import styles from './index.module.css'

export default function Datatoken(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)

  async function generateName() {
    const dataTokenOptions = utils.generateDatatokenName()
    helpers.setValue({ ...dataTokenOptions })
  }

  // Generate new DT name & symbol on first mount
  useEffect(() => {
    generateName()
  }, [])

  return (
    <div className={styles.datatoken}>
      <strong>{field?.value?.name}</strong> —{' '}
      <strong>{field?.value?.symbol}</strong>
      <RefreshName generateName={generateName} />
    </div>
  )
}
