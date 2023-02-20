import React, { useState } from 'react'
import Caret from '@images/caret.svg'
import { accountTruncate } from '@utils/web3'
import styles from './Account.module.css'
import { useWeb3 } from '@context/Web3'
import Avatar from '@shared/atoms/Avatar'
import Modal from '@components/@shared/atoms/Modal'

// Forward ref for Tippy.js
// eslint-disable-next-line
const Account = React.forwardRef((props, ref: any) => {
  const {
    accountId,
    accountEns,
    accountEnsAvatar,
    connectWeb3Modal,
    connectMetaMask
  } = useWeb3()

  const [isModalOpen, setIsModalOpen] = useState(false)

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
    <>
      <button
        className={`${styles.button} ${styles.initial}`}
        onClick={() => setIsModalOpen(true)}
        // Need the `ref` here although we do not want
        // the Tippy to show in this state.
        ref={ref}
      >
        Connect <span>Wallet</span>
      </button>
      <Modal
        title={'Connect Wallet'}
        isOpen={isModalOpen}
        onToggleModal={() => setIsModalOpen(false)}
      >
        <button onClick={() => connectMetaMask()}>MetaMask</button>
        <button onClick={() => connectWeb3Modal()}>WalletConnect</button>
      </Modal>
    </>
  )
})

export default Account
