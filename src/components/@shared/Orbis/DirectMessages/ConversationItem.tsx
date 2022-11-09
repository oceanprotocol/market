import React, { useState, useEffect } from 'react'
import { useCancelToken } from '@hooks/useCancelToken'
import { useOrbis } from '@context/Orbis'
import { accountTruncate } from '@utils/web3'
import { didToAddress } from '@utils/orbis'
import Avatar from '@shared/atoms/Avatar'
import Time from '@shared/atoms/Time'
import styles from './ConversationItem.module.css'

export default function ConversationItem({
  conversation,
  unreads,
  setConversationId
}: {
  conversation: OrbisConversationInterface
  unreads: number
  setConversationId: (value: string) => void
}) {
  const { account } = useOrbis()

  const newCancelToken = useCancelToken()

  const [name, setName] = useState(null)
  const [address, setAddress] = useState(null)

  useEffect(() => {
    const getProfile = async () => {
      const details = conversation.recipients_details.find(
        (o) => o.did !== account.did
      )

      const _address = didToAddress(details?.did)
      setAddress(_address)

      if (details?.metadata?.ensName) {
        setName(details?.metadata?.ensName)
      } else if (details?.profile?.username) {
        setName(details?.profile?.username)
      } else {
        setName(accountTruncate(_address))
      }
    }

    if (conversation && account) {
      getProfile()
    }
  }, [conversation, account, newCancelToken])

  return (
    <div
      className={styles.conversationItem}
      onClick={() => setConversationId(conversation.stream_id)}
    >
      <div className={styles.accountAvatarSet}>
        <Avatar accountId={address} className={styles.accountAvatar} />
        {unreads > 0 && (
          <div className={styles.notificationCount}>{unreads}</div>
        )}
      </div>
      <div className={styles.accountInfo}>
        <div className={styles.accountHeading}>
          <h3 className={styles.accountName}>{name}</h3>
          <span className={styles.lastMessageDate}>
            <Time
              date={conversation.last_message_timestamp.toString()}
              isUnix={true}
              relative
            />
          </span>
        </div>
        {/* <p className={styles.accountChat}>{conversation.chat}</p> */}
      </div>
    </div>
  )
}
