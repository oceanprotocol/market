import React, { ReactElement, useEffect, useState } from 'react'
import Button from '../../atoms/Button'
import styles from './Details.module.css'
import { useOcean } from '@oceanprotocol/react'
import Web3Feedback from './Feedback'
import { formatNumber } from '../../../utils'
import { connectWallet, getNetworkName } from '../../../utils/wallet'
import { getInjectedProviderName } from 'web3modal'

export default function Details({ attrs }: { attrs: any }): ReactElement {
  const { ocean, balance, connect, logout, chainId } = useOcean()
  const [balanceOcean, setBalanceOcean] = useState('0')

  useEffect(() => {
    async function init() {
      if (!ocean) return

      const accounts = await ocean.accounts.list()
      const newBalanceOcean = await accounts[0].getOceanBalance()
      newBalanceOcean && setBalanceOcean(newBalanceOcean)
    }
    init()
  }, [ocean])

  return (
    <div className={styles.details} {...attrs}>
      <ul>
        <li className={styles.balance}>
          <span>OCEAN</span> {balanceOcean}
        </li>
        <li className={styles.balance}>
          <span>ETH</span> {formatNumber(Number(balance))}
        </li>
        <li className={styles.actions}>
          <span title="Connected provider">
            {getInjectedProviderName()}
            <br />
            {getNetworkName(chainId)}
          </span>
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
