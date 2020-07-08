import React, { ReactElement } from 'react'
import Button from '../../atoms/Button'
import styles from './Details.module.css'
import { useWeb3, useOcean } from '@oceanprotocol/react'
import Web3Feedback from './Feedback'
import { formatNumber } from '../../../utils'

export default function Details({ attrs }: { attrs: any }): ReactElement {
  const { balance, web3Connect } = useWeb3()
  const { balanceInOcean } = useOcean()
  const ethBalanceText = formatNumber(Number(balance))
  const oceanBalanceText = formatNumber(Number(balanceInOcean))

  return (
    <div className={styles.details}>
      <ul {...attrs}>
        <li className={styles.balance}>
          OCEAN <span>{oceanBalanceText}</span>
        </li>
        <li className={styles.balance}>
          ETH <span>{ethBalanceText}</span>
        </li>
        <li>
          <Button
            style="text"
            size="small"
            onClick={() => web3Connect.toggleModal()}
          >
            Switch Wallet
          </Button>
        </li>
      </ul>
      <Web3Feedback />
    </div>
  )
}
