import React, { ReactElement, useEffect } from 'react'
import Button from '../../atoms/Button'
import styles from './Details.module.css'
import { useOcean } from '@oceanprotocol/react'
import Web3Feedback from './Feedback'
import { getInjectedProviderName } from 'web3modal'
import Conversion from '../../atoms/Price/Conversion'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useUserPreferences } from '../../../providers/UserPreferences'

export default function Details(): ReactElement {
  const { balance, connect, logout } = useOcean()
  const { locale } = useUserPreferences()

  return (
    <div className={styles.details}>
      <ul>
        {Object.entries(balance).map(([key, value]) => (
          <li className={styles.balance} key={key}>
            <span className={styles.symbol}>{key.toUpperCase()}</span>{' '}
            {formatCurrency(Number(value), '', locale, false, {
              significantFigures: 4
            })}
            {key === 'ocean' && <Conversion price={value} />}
          </li>
        ))}

        <li className={styles.actions}>
          <span title="Connected provider">{getInjectedProviderName()}</span>
          <Button
            style="text"
            size="small"
            onClick={() => {
              logout()
              connect()
            }}
          >
            Switch Wallet
          </Button>
        </li>
      </ul>
      <Web3Feedback />
    </div>
  )
}
