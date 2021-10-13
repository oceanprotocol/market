import React, { ReactElement } from 'react'
import stylesIndex from './index.module.css'
import styles from './Free.module.css'
import FormHelp from '@shared/Form/Input/Help'
import { DDO } from '@oceanprotocol/lib'
import Price from './Price'

export default function Free({
  ddo,
  content
}: {
  ddo: DDO
  content: any
}): ReactElement {
  return (
    <div className={styles.free}>
      <FormHelp className={stylesIndex.help}>{content.info}</FormHelp>
      <Price ddo={ddo} free />
    </div>
  )
}
