import React, { FormEvent } from 'react'
import Caret from '@images/caret.svg'
import { accountTruncate } from '@utils/web3'
import Loader from '@shared/atoms/Loader'
import styles from './Account.module.css'
import { useWeb3 } from '@context/Web3'
import Blockies from '@shared/atoms/Blockies'

// Forward ref for Tippy.js
// eslint-disable-next-line
const Account = React.forwardRef((props, ref: any) => {
  const { accountId, accountEns, web3Modal, connect } = useWeb3()

  async function handleActivation(e: FormEvent<HTMLButtonElement>) {
    // prevent accidentially submitting a form the button might be in
    e.preventDefault()

    await connect()
  }

  return !accountId && web3Modal?.cachedProvider ? (
    // Improve user experience for cached provider when connecting takes some time
    <button className={styles.button} onClick={(e) => e.preventDefault()}>
      <Loader />
    </button>
  ) : accountId ? (
    <button
      className={styles.button}
      aria-label="Account"
      ref={ref}
      onClick={(e) => e.preventDefault()}
    >
      <Blockies accountId={accountId} />
      <span className={styles.address} title={accountId}>
        {accountTruncate(accountEns || accountId)}
      </span>
      <Caret aria-hidden="true" className={styles.caret} />
    </button>
  ) : (
    <button
      className={`${styles.button} ${styles.initial}`}
      onClick={(e) => handleActivation(e)}
      // Need the `ref` here although we do not want
      // the Tippy to show in this state.
      ref={ref}
    >
      Connect <span>Wallet</span>
    </button>
  )
})

export default Account
