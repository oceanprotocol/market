import React from 'react'
import styles from './Account.module.css'
import { useWeb3, useOcean } from '@oceanprotocol/react'
import { toDataUrl } from 'ethereum-blockies'
import { ReactComponent as Caret } from '../../../images/caret.svg'
import Status from '../../atoms/Status'

function accountTruncate(account: string) {
  const middle = account.substring(6, 38)
  const truncated = account.replace(middle, '…')
  return truncated
}

const Blockies = ({ account }: { account: string | undefined }) => {
  if (!account) return null
  const blockies = toDataUrl(account)

  return (
    <img
      className={styles.blockies}
      src={blockies}
      alt="Blockies"
      aria-hidden="true"
    />
  )
}

// Forward ref for Tippy.js
// eslint-disable-next-line
const Account = React.forwardRef((props, ref: any) => {
  const { account, web3Connect, ethProviderStatus } = useWeb3()
  const { status } = useOcean()
  const hasSuccess = ethProviderStatus === 1 && status === 1

  return account ? (
    <button className={styles.button} aria-label="Account" ref={ref}>
      <Blockies account={account} />
      <span className={styles.address} title={account}>
        {accountTruncate(account)}
      </span>
      {!hasSuccess && (
        <Status className={styles.status} state="warning" aria-hidden />
      )}
      <Caret aria-hidden="true" />
    </button>
  ) : (
    <button
      className={styles.button}
      onClick={() => web3Connect.connect()}
      // Need the `ref` here although we do not want
      // the Tippy to show in this state.
      ref={ref}
    >
      Activate Wallet
    </button>
  )
})

export default Account
