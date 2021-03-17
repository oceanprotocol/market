import { useField } from 'formik'
import { InputProps } from '../../../atoms/Input'
import { useOcean } from '../../../../providers/Ocean'
import React, { ReactElement, useEffect } from 'react'
import styles from './index.module.css'

import RefreshName from './RefreshName'

export default function Datatoken(props: InputProps): ReactElement {
  const { ocean } = useOcean()
  const [field, meta, helpers] = useField(props.name)

  function generateName() {
    if (!ocean) return
    const dataTokenOptions = ocean.datatokens.generateDtName()
    helpers.setValue({ ...dataTokenOptions })
  }

  // Generate new DT name & symbol
  useEffect(() => {
    if (!ocean) return
    generateName()
  }, [ocean])

  return (
    <div className={styles.datatoken}>
      <strong>{field?.value?.name}</strong> —{' '}
      <strong>{field?.value?.symbol}</strong>
      <RefreshName generateName={generateName} />
    </div>
  )
}
