import React from 'react'
import styles from './Account.module.css'
import { useOcean } from '@oceanprotocol/react'
import { toDataUrl } from 'ethereum-blockies'
import { ReactComponent as Caret } from '../../../images/caret.svg'
import Status from '../../atoms/Status'
import { accountTruncate, connectWallet } from '../../../utils/wallet'

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
  const { accountId, status, connect } = useOcean()
  const hasSuccess = status === 1

  return accountId ? (
    <button className={styles.button} aria-label="Account" ref={ref}>
      <Blockies account={accountId} />
      <span className={styles.address} title={accountId}>
        {accountTruncate(accountId)}
      </span>
      {!hasSuccess && (
        <Status className={styles.status} state="warning" aria-hidden />
      )}
      <Caret aria-hidden="true" />
    </button>
  ) : (
    <button
      className={styles.button}
      onClick={async () => await connectWallet(connect)}
      // Need the `ref` here although we do not want
      // the Tippy to show in this state.
      ref={ref}
    >
      Activate Wallet
    </button>
  )
})

export default Account
