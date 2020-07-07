import React, { ReactElement } from 'react'
import { toDataUrl } from 'ethereum-blockies'
import styles from './Wallet.module.css'
import Button from '../../atoms/Button'
import { formatNumber } from '../../../utils'
import { useWeb3 } from '@oceanprotocol/react'

const Wallet = ({ balanceOcean }: { balanceOcean: string }): ReactElement => {
  const { account, balance, web3Connect } = useWeb3()
  const ethBalanceText = formatNumber(Number(balance))
  const oceanBalanceText = formatNumber(Number(balanceOcean))
  const blockies = account && toDataUrl(account)

  return (
    <div className={styles.wallet}>
      {account ? (
        <ul>
          <li className={styles.address} title={account}>
            <img className={styles.blockies} src={blockies} alt="Blockies" />
            {`${account.substring(0, 8)}...`}
          </li>
          <li className={styles.balance}>
            OCEAN <span>{oceanBalanceText}</span>
          </li>
          <li className={styles.balance}>
            ETH <span>{ethBalanceText}</span>
          </li>
        </ul>
      ) : (
        <Button style="text" size="small" onClick={() => web3Connect.connect()}>
          Activate Wallet
        </Button>
      )}
    </div>
  )
}

export default Wallet
