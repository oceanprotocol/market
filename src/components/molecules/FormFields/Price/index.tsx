import React, { ReactElement } from 'react'
import { InputProps } from '../../../atoms/Input'
import styles from './index.module.css'
import Tabs from '../../../atoms/Tabs'
import Simple from './Simple'
import Advanced from './Advanced'

export default function Price(props: InputProps): ReactElement {
  const tabs = [
    { title: 'Simple: Fixed', content: <Simple {...props} /> },
    { title: 'Advanced: Dynamic', content: <Advanced {...props} /> }
  ]

  return (
    <div className={styles.price}>
      <Tabs items={tabs} />
    </div>
  )
}
