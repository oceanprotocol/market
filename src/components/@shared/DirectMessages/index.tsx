import React from 'react'
import styles from './index.module.css'
import Conversation from './Conversation'
import { useOrbis } from '@context/DirectMessages'
import { useAccount, useConnect } from 'wagmi'
import Header from './Header'
import List from './List'
import walletStyles from '../../Header/Wallet/Account.module.css'

const BodyContent = () => {
  const { account, conversationId, checkOrbisConnection } = useOrbis()
  const { address: accountId } = useAccount()

  const handleActivation = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (accountId) {
      await checkOrbisConnection({
        address: accountId,
        autoConnect: true,
        lit: true
      })
    }
  }

  const message = () => {
    return (
      <>
        <p>A new decentralized, encrypted private messaging is here!</p>
        <p>
          Engage with data publishers, get your algorithms whitelisted and
          establish trust.
        </p>
        <p>
          You&apos;ll be required to sign 2 transactions, one to connect to your
          decentralized identity and the other to generate your encrypted key.
        </p>
      </>
    )
  }

  if (!accountId) {
    return (
      <div className={styles.walletWrapper}>
        <div>
          <h5>Connect your wallet to start messaging</h5>
          {message()}
          <button
            className={`${walletStyles.button} ${walletStyles.initial}`}
            onClick={(e) => handleActivation(e)}
          >
            Connect <span>Wallet</span>
          </button>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className={styles.walletWrapper}>
        <div>
          <h5>Sign your wallet to start messaging</h5>
          {message()}
          <button
            className={`${walletStyles.button} ${walletStyles.initial}`}
            onClick={() =>
              checkOrbisConnection({
                address: accountId,
                autoConnect: true,
                lit: true
              })
            }
          >
            Sign <span>Wallet</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <List />
      {conversationId && <Conversation />}
    </>
  )
}

export default function DirectMessages() {
  const { openConversations } = useOrbis()

  return (
    <div
      className={`${styles.wrapper} ${!openConversations && styles.isClosed}`}
    >
      <div className={styles.floating}>
        <div className={styles.headerWrapper}>
          <Header />
        </div>
        <div className={styles.bodyWrapper}>
          <BodyContent />
        </div>
      </div>
    </div>
  )
}
