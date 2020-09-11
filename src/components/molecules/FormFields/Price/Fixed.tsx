import React, { ReactElement, ChangeEvent } from 'react'
import stylesIndex from './index.module.css'
import styles from './Fixed.module.css'
import FormHelp from '../../../atoms/Input/Help'
import Label from '../../../atoms/Input/Label'
import InputElement from '../../../atoms/Input/InputElement'
import Conversion from '../../../atoms/Price/Conversion'
import { DataTokenOptions } from '@oceanprotocol/react'
import RefreshName from './RefreshName'

export default function Fixed({
  ocean,
  datatokenOptions,
  onChange,
  generateName,
  content
}: {
  ocean: string
  datatokenOptions: DataTokenOptions
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  generateName: () => void
  content: any
}): ReactElement {
  return (
    <div className={styles.fixed}>
      <FormHelp className={stylesIndex.help}>{content.info}</FormHelp>

      <div className={styles.grid}>
        <div className={styles.form}>
          <Label htmlFor="ocean">Ocean Token</Label>
          <InputElement
            value={ocean}
            name="ocean"
            type="number"
            prefix="OCEAN"
            onChange={onChange}
          />
          <Conversion price={ocean} className={stylesIndex.conversion} />
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
