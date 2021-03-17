import React, { ReactElement, useState } from 'react'
import Account from './Account'
import Details from './Details'
import Tooltip from '../../atoms/Tooltip'
import Network from './Network'
import { useOcean } from '@oceanprotocol/react'
import styles from './index.module.css'

export default function Wallet(): ReactElement {
  const { accountId } = useOcean()

  return (
    <div className={styles.wallet}>
      <Network />
      <Tooltip
        content={<Details />}
        trigger="click focus"
        disabled={!accountId}
      >
        <Account />
      </Tooltip>
    </div>
  )
}
