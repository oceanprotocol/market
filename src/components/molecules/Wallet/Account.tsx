import { useOcean } from '@oceanprotocol/react'
import { toDataUrl } from 'ethereum-blockies'
import React, { FormEvent } from 'react'
import { ReactComponent as Caret } from '../../../images/caret.svg'
import { accountTruncate, isCorrectNetwork } from '../../../utils/wallet'
import Status from '../../atoms/Status'
import styles from './Account.module.css'

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
  const { accountId, status, connect, networkId } = useOcean()
  const hasSuccess = status === 1 && isCorrectNetwork(networkId)
  console.log(networkId)

  async function handleActivation(e: FormEvent<HTMLButtonElement>) {
    // prevent accidentially submitting a form the button might be in
    e.preventDefault()
    await connect()
  }

  // prevent accidentially submitting a form the button might be in
  function handleButton(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()
  }

  return accountId ? (
    <button
      className={styles.button}
      aria-label="Account"
      ref={ref}
      onClick={(e) => handleButton(e)}
    >
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
      className={`${styles.button} ${styles.initial}`}
      onClick={(e) => handleActivation(e)}
      // Need the `ref` here although we do not want
      // the Tippy to show in this state.
      ref={ref}
    >
      Connect Wallet
    </button>
  )
})

export default Account
