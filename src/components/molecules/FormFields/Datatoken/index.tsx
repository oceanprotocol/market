import { useField } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import { generateDatatokenName } from '@oceanprotocol/lib/dist/node/utils'
import { InputProps } from '../../../atoms/Input'
import RefreshName from './RefreshName'
import styles from './index.module.css'

export default function Datatoken(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)

  async function generateName() {
    const dataTokenOptions = generateDatatokenName()
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
