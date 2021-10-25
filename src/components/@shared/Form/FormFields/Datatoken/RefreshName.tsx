import React, { ReactElement } from 'react'
import styles from './RefreshName.module.css'
import Button from '@shared/atoms/Button'
import Refresh from '@images/refresh.svg'

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
