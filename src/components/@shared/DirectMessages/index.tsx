import React from 'react'
import styles from './index.module.css'
import Conversation from './Conversation'
import { useOrbis } from '@context/DirectMessages'
import { useWeb3 } from '@context/Web3'
import Header from './Header'
import List from './List'
import walletStyles from '../../Header/Wallet/Account.module.css'

const BodyContent = () => {
  const { account, conversationId, checkOrbisConnection } = useOrbis()
  const { accountId, connect } = useWeb3()

  const handleActivation = async (e: React.MouseEvent) => {
    e.preventDefault()
    const resConnect = await connect()
    if (resConnect) {
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
