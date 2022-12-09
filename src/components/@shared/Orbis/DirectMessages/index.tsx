import React from 'react'
import styles from './index.module.css'
import Conversation from './Conversation'
import { useOrbis } from '@context/Orbis'
import { useWeb3 } from '@context/Web3'
import Header from './Header'
import List from './List'
import walletStyles from '../../../Header/Wallet/Account.module.css'
// import loadable from '@loadable/component'
// const Wallet = loadable(() => import('../../../Header/Wallet'))

const BodyContent = () => {
  const { account, conversationId, checkOrbisConnection } = useOrbis()
  const { accountId, connect } = useWeb3()

  const handleActivation = async (e: React.MouseEvent) => {
    e.preventDefault()
    const resConnect = await connect()
    if (resConnect) {
      await checkOrbisConnection({ autoConnect: true, lit: true })
    }
  }

  if (!accountId) {
    return (
      <div className={styles.walletWrapper}>
        <div>
          <h5>Connect your wallet to start messaging</h5>
          <p>You will be ask to sign:</p>
          <p>
            Sign 1: Create your decentralized Identity (DID) to share a message
            and own it
          </p>
          <p>Sign 2: Create your encrypted key to enable private messages</p>
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
          <p>
            Sign 1: Create your decentralized Identity (DID) to share a message
            and own it
          </p>
          <p>Sign 2: Create your encrypted key to enable private messages</p>
          <button
            className={`${walletStyles.button} ${walletStyles.initial}`}
            onClick={() =>
              checkOrbisConnection({ autoConnect: true, lit: true })
            }
          >
            Sign <span>Wallet</span>
          </button>
        </div>
      </div>
    )
  }

  if (conversationId) {
    return <Conversation />
  }

  return <List />
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
