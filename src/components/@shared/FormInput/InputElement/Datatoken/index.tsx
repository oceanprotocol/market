import { useField } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import { InputProps } from '@shared/FormInput'
import Logo from '@images/logo.svg'
import RefreshName from './RefreshName'
import styles from './index.module.css'
import { generateDtName } from '@oceanprotocol/lib'

export default function Datatoken(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)

  async function generateName() {
    const datatokenOptions = generateDtName()
    helpers.setValue({ ...datatokenOptions })
  }

  // Generate new DT name & symbol on first mount
  useEffect(() => {
    if (field.value?.name !== '') return

    generateName()
  }, [field.value?.name])

  return (
    <div className={styles.datatoken}>
      <figure className={styles.image}>
        <Logo />
      </figure>
      <div className={styles.token}>
        <strong>{field?.value?.name}</strong> —{' '}
        <strong>{field?.value?.symbol}</strong>
        <RefreshName generateName={generateName} />
      </div>
    </div>
  )
}
