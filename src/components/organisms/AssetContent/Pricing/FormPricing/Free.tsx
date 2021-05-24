import React, { ReactElement } from 'react'
import stylesIndex from './index.module.css'
import styles from './Free.module.css'
import FormHelp from '../../../../atoms/Input/Help'

export default function Free({ content }: { content: any }): ReactElement {
  return (
    <div className={styles.free}>
      <FormHelp className={stylesIndex.help}>{content.info}</FormHelp>
    </div>
  )
}
