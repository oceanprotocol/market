import React, { ReactElement } from 'react'
import Account from './Account'
import Details from './Details'
import Tooltip from '@shared/atoms/Tooltip'
import Network from './Network'
import styles from './index.module.css'
import { useAppKitAccount } from '@reown/appkit/react'

export default function Wallet(): ReactElement {
  const { address } = useAppKitAccount()

  return (
    <div className={styles.wallet}>
      <Network />
      <Tooltip content={<Details />} trigger="click focus" disabled={!address}>
        <Account />
      </Tooltip>
    </div>
  )
}
