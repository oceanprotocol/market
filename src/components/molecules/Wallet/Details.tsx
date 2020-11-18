import React, { ReactElement, useEffect } from 'react'
import Button from '../../atoms/Button'
import styles from './Details.module.css'
import { useOcean } from '@oceanprotocol/react'
import Web3Feedback from './Feedback'
import { getInjectedProviderName } from 'web3modal'
import Conversion from '../../atoms/Price/Conversion'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { useProfile } from '../../../providers/Profile'

export default function Details(): ReactElement {
  const { balance, connect, logout } = useOcean()
  const { locale } = useUserPreferences()

  const { box, getProfile } = useProfile()

  useEffect(() => {
    console.log(box)
  }, [box])

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
          <Button
            style="text"
            size="small"
            onClick={() => {
              getProfile()
            }}
          >
            Sign in profile
          </Button>
        </li>
      </ul>
      <Web3Feedback />
    </div>
  )
}
