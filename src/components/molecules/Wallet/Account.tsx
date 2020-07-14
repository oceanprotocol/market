import React from 'react'
import styles from './Account.module.css'
import { useOcean } from '@oceanprotocol/react'
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
  const { accountId, status, web3Modal } = useOcean()
  const hasSuccess = status === 1

  console.log(web3Modal)

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
      onClick={() => web3Modal.toggleModal()}
      // Need the `ref` here although we do not want
      // the Tippy to show in this state.
      ref={ref}
    >
      Activate Wallet
    </button>
  )
})

export default Account
