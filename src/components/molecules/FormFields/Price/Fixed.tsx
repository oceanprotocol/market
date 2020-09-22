import React, { ReactElement } from 'react'
import stylesIndex from './index.module.css'
import styles from './Fixed.module.css'
import FormHelp from '../../../atoms/Input/Help'
import Conversion from '../../../atoms/Price/Conversion'
import { DataTokenOptions } from '@oceanprotocol/react'
import RefreshName from './RefreshName'
import { useField } from 'formik'
import Input from '../../../atoms/Input'
import Error from './Error'

export default function Fixed({
  datatokenOptions,
  generateName,
  content
}: {
  datatokenOptions: DataTokenOptions
  generateName: () => void
  content: any
}): ReactElement {
  const [field, meta] = useField('price.price')

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
            min="1"
            {...field}
            additionalComponent={
              <Conversion
                price={field.value}
                className={stylesIndex.conversion}
              />
            }
          />
          <Error meta={meta} />
        </div>

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
