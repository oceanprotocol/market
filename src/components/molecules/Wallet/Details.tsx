import React, { ReactElement } from 'react'
import Button from '../../atoms/Button'
import styles from './Details.module.css'
import { useOcean } from '@oceanprotocol/react'
import Web3Feedback from './Feedback'
import { formatNumber } from '../../../utils'

export default function Details({ attrs }: { attrs: any }): ReactElement {
  const { balance, web3Modal } = useOcean()
  const ethBalanceText = 'hello test'
  // || formatNumber(Number(balance.eth))
  const oceanBalanceText = 'hello test'
  // || formatNumber(Number(balance.ocean))

  return (
    <div className={styles.details} {...attrs}>
      <ul>
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
            onClick={() => web3Modal.toggleModal()}
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
