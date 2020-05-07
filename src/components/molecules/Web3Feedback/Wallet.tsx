import React from 'react'
import styles from './Wallet.module.css'
import Button from '../../atoms/Button'
import useWeb3 from '../../../hooks/useWeb3'
import { formatNumber } from '../../../utils'

const Wallet = ({ balanceOcean }: { balanceOcean: string }) => {
  const { account, balance, web3Connect } = useWeb3()
  const ethBalanceText = formatNumber(Number(balance))
  const oceanBalanceText = formatNumber(Number(balanceOcean))

  return (
    <div className={styles.wallet}>
      {account ? (
        <ul>
          <li className={styles.address} title={account}>
            {`${account.substring(0, 12)}...`}
          </li>
          <li className={styles.balance} title="OCEAN">
            Ọ <span>{oceanBalanceText}</span>
          </li>
          <li className={styles.balance} title="ETH">
            Ξ <span>{ethBalanceText}</span>
          </li>
        </ul>
      ) : (
        <Button link onClick={() => web3Connect.connect()}>
          Activate Wallet
        </Button>
      )}
    </div>
  )
}

export default Wallet
