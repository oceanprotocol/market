import React, { ReactElement } from 'react'
import stylesIndex from './index.module.css'
import styles from './Simple.module.css'
import FormHelp from '../../../atoms/Input/Help'
import { InputProps } from '../../../atoms/Input'
import Cost from './Cost'

export default function Simple(props: InputProps): ReactElement {
  return (
    <div className={stylesIndex.content}>
      <div className={styles.simple}>
        <Cost {...props} />
      </div>
      {props.help && <FormHelp>{props.help}</FormHelp>}
    </div>
  )
}
