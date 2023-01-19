import React, { FormEvent } from 'react'
import Caret from '@images/caret.svg'
import { accountTruncate } from '@utils/wallet'
// import Loader from '@shared/atoms/Loader'
import styles from './Account.module.css'
import Avatar from '@shared/atoms/Avatar'
import { useAccount, useProvider, useEnsName, useEnsAvatar } from 'wagmi'
import { useWeb3Modal } from '@web3modal/react'

// Forward ref for Tippy.js
// eslint-disable-next-line
const Account = React.forwardRef((props, ref: any) => {
  // const provider = useProvider()
  const { address: accountId } = useAccount()
  const { data: accountEns } = useEnsName({ address: accountId, chainId: 1 })
  const { data: accountEnsAvatar } = useEnsAvatar({
    address: accountId,
    chainId: 1
  })
  const { open } = useWeb3Modal()

  async function handleActivation(e: FormEvent<HTMLButtonElement>) {
    // prevent accidentially submitting a form the button might be in
    e.preventDefault()

    await open()
  }

  // return
  // !accountId && provider ? (
  //   // Improve user experience for cached provider when connecting takes some time
  //   <button className={styles.button} onClick={(e) => e.preventDefault()}>
  //     <Loader />
  //   </button>
  // ) :
  return accountId ? (
    <button
      className={styles.button}
      aria-label="Account"
      ref={ref}
      onClick={(e) => e.preventDefault()}
    >
      <Avatar accountId={accountId} src={accountEnsAvatar} />
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
