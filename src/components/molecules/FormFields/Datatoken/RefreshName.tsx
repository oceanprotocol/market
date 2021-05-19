import React, { ReactElement } from 'react'
import * as styles from './RefreshName.module.css'
import Button from '../../../atoms/Button'
import { ReactComponent as Refresh } from '../../../../images/refresh.svg'

export default function RefreshName({
  generateName
}: {
  generateName: () => void
}): ReactElement {
  return (
    <Button
      style="text"
      size="small"
      className={styles.refresh}
      title="Generate new name & symbol"
      onClick={(e) => {
        e.preventDefault()
        generateName()
      }}
    >
      <Refresh />
    </Button>
  )
}
