import React, { ReactElement, useState } from 'react'
import Account from './Account'
import Details from './Details'
import Tooltip from '../../atoms/Tooltip'
import Network from './Network'
import styles from './index.module.css'
import { useWeb3 } from '../../../providers/Web3'

export default function Wallet(): ReactElement {
  const { accountId } = useWeb3()

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
