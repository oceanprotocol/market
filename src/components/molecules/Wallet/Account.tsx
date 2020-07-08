import React from 'react'
import Button from '../../atoms/Button'
import styles from './Account.module.css'
import { useWeb3 } from '@oceanprotocol/react'
import { toDataUrl } from 'ethereum-blockies'

// Forward ref for Tippy.js
// eslint-disable-next-line
const Account = React.forwardRef((props, ref: any) => {
  const { account, web3Connect } = useWeb3()
  const blockies = account && toDataUrl(account)

  return (
    <div className={styles.wallet} ref={ref}>
      {account ? (
        <div className={styles.address}>
          <img className={styles.blockies} src={blockies} alt="Blockies" />
          {`${account.substring(0, 12)}...`}
        </div>
      ) : (
        <Button style="text" size="small" onClick={() => web3Connect.connect()}>
          Activate Wallet
        </Button>
      )}
    </div>
  )
})

export default Account
