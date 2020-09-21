import React, { ReactElement } from 'react'
import stylesIndex from './index.module.css'
import styles from './Fixed.module.css'
import FormHelp from '../../../atoms/Input/Help'
import Conversion from '../../../atoms/Price/Conversion'
import { DataTokenOptions } from '@oceanprotocol/react'
import RefreshName from './RefreshName'
import { useField } from 'formik'
import Input from '../../../atoms/Input'

export default function Fixed({
  datatokenOptions,
  generateName,
  content
}: {
  datatokenOptions: DataTokenOptions
  generateName: () => void
  content: any
}): ReactElement {
  const [field, meta, helpers] = useField('price.price')

  return (
    <div className={styles.fixed}>
      <FormHelp className={stylesIndex.help}>{content.info}</FormHelp>

      <div className={styles.grid}>
        <div className={styles.form}>
          <Input
            label="Ocean Token"
            value={field.value}
            name="price.price"
            type="number"
            prefix="OCEAN"
            {...field}
          />
          <Conversion price={field.value} className={stylesIndex.conversion} />
        </div>
        {meta.error && meta.touched && <div>{meta.error}</div>}
        {datatokenOptions && (
          <div className={styles.datatoken}>
            <h4>
              Data Token <RefreshName generateName={generateName} />
            </h4>
            <strong>{datatokenOptions?.name}</strong> —{' '}
            <strong>{datatokenOptions?.symbol}</strong>
          </div>
        )}
      </div>
    </div>
  )
}
