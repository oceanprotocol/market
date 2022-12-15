import React, { useState, useEffect } from 'react'
import { useCancelToken } from '@hooks/useCancelToken'
import { useOrbis } from '@context/Orbis'
import { didToAddress } from '@utils/orbis'
import Avatar from '@shared/atoms/Avatar'
import Time from '@shared/atoms/Time'
import styles from './ListItem.module.css'

export default function ConversationItem({
  conversation,
  unreads,
  setConversationId
}: {
  conversation: IOrbisConversation
  unreads: number
  setConversationId: (value: string) => void
}) {
  const { account, getConversationTitle } = useOrbis()

  const newCancelToken = useCancelToken()

  const [name, setName] = useState<string>(null)
  const [address, setAddress] = useState(null)

  useEffect(() => {
    const getProfile = async () => {
      const did = conversation.recipients.find((o) => o !== account.did)

      const _address = didToAddress(did)
      setAddress(_address)

      const _name = await getConversationTitle(conversation?.stream_id)
      setName(_name)
    }

    if (conversation && account) {
      getProfile()
    }
  }, [conversation, account, newCancelToken, getConversationTitle])

  return (
    <div
      className={styles.conversation}
      onClick={() => setConversationId(conversation.stream_id)}
    >
      <div className={styles.accountAvatarSet}>
        <Avatar accountId={address} className={styles.accountAvatar} />
        {unreads > 0 && (
          <div className={styles.notificationCount}>{unreads}</div>
        )}
      </div>
      <div className={styles.accountInfo}>
        <div className={styles.accountName}>{name}</div>
        <span className={styles.lastMessageDate}>
          <Time
            date={conversation.last_message_timestamp.toString()}
            isUnix={true}
            relative={false}
            displayFormat="Pp"
          />
        </span>
      </div>
    </div>
  )
}
