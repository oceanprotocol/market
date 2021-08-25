import React, { ReactElement } from 'react'
import stylesIndex from './index.module.css'
import styles from './Fixed.module.css'
import FormHelp from '../../../../atoms/Input/Help'
import { DDO } from '@oceanprotocol/lib'
import Price from './Price'
import Fees from './Fees'

export default function Fixed({
  ddo,
  content
}: {
  ddo: DDO
  content: any
}): ReactElement {
  return (
    <div className={styles.fixed}>
      <FormHelp className={stylesIndex.help}>{content.info}</FormHelp>
      <Price ddo={ddo} />
      <Fees tooltips={content.tooltips} pricingType="fixed" />
    </div>
  )
}
