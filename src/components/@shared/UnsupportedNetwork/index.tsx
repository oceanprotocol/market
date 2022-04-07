import React, { ReactElement } from 'react'
import styles from './index.module.css'

export default function UnsuportedNetwork(): ReactElement {
  function changeNetwork() {
    console.log('Change Network')
  }
  return (
    <>
      You are currently on an unsupported network. Please switch to a supported
      network to proceed with publishing.
      <br />
      <br />
      <b>Supported Networks:</b>
    </>
  )
}
