import React, { ReactElement } from 'react'
import Button from '../../atoms/Button'
import styles from './Details.module.css'
import { useOcean } from '@oceanprotocol/react'
import Web3Feedback from './Feedback'
import { formatNumber } from '../../../utils'
import { connectWallet } from '../../../utils/wallet'

export default function Details({ attrs }: { attrs: any }): ReactElement {
  const { balance, connect, logout } = useOcean()
  const oceanBalance = 'Hello Test'

  return (
    <div className={styles.details} {...attrs}>
      <ul>
        <li className={styles.balance}>
          <span>OCEAN</span> {oceanBalance}
        </li>
        <li className={styles.balance}>
          <span>ETH</span> {formatNumber(Number(balance))}
        </li>
        <li className={styles.actions}>
          <Button
            style="text"
            size="small"
            onClick={async () => {
              await logout()
              await connectWallet(connect)
            }}
          >
            Switch Wallet
          </Button>
        </li>
      </ul>
      <Web3Feedback />
      <div className={styles.arrow} data-popper-arrow />
    </div>
  )
}
