import React, { ReactElement } from 'react'
import Alert from '@shared/atoms/Alert'
import styles from './index.module.css'

export default function UnsuportedNetwork(): ReactElement {
  function changeNetwork() {
    console.log('Change Network')
  }
  return (
    <Alert
      title="You are on an unsupported network"
      text="Please switch to a supported network"
      state="error"
      className={styles.alert}
      action={{
        name: 'Change Network',
        style: 'primary',
        handleAction: () => changeNetwork()
      }}
    />
  )
}
