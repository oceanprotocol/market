import React, { ReactElement } from 'react'
import Button from '../../atoms/Button'
import styles from './Details.module.css'
import { useOcean } from '@oceanprotocol/react'
import Web3Feedback from './Feedback'
import { formatNumber } from '../../../utils'
import { connectWallet } from '../../../utils/wallet'
import { getInjectedProviderName } from 'web3modal'

export default function Details({ attrs }: { attrs: any }): ReactElement {
  const { balance, connect, logout, web3Provider } = useOcean()
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
          <span title="Connected provider">{getInjectedProviderName()}</span>
          <Button
            style="text"
            size="small"
            onClick={() => {
              logout()
              connectWallet(connect)
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
